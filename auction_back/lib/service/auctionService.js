const { json } = require("body-parser");
const DB = require("../db/db");

const auctionService = {
    goodsRegist : (req, res) => {
        let post = req.body;
        let files = req.files;
        let mId = req.user;

        DB.query('INSERT INTO TBL_GOODS_REGIST(GR_NAME, GR_PRICE, GR_INFO, M_ID) VALUES(?, ?, ?, ?)', 
        [post.grName, post.grPrice, post.grInfo, mId],
        (error, result) => {
            if(error){
                console.log(error)
                for(let i = 0; i < files.length; i++) {
                    fs.unlink(`C:/acution/goodsImg/${req.file.filename}`, (error) => {
                        console.log('UPLOADED FILE DELETE COMPLETED!!');
                    });
                }
                res.json('fail');
            } else {              
                let grNo = result.insertId;

                for(let i = 0; i < files.length; i++) {
                    DB.query('INSERT INTO TBL_GOODS_IMG(GI_NAME, GR_NO) VALUES(?, ?)',
                    [files[i].filename,grNo],
                    (error, result) => {
                        if(error)
                            console.log(error);
                    });
                }
                res.json('success');
            }
        });
    },
    currentList : (req, res) => {
        DB.query(`SELECT * FROM TBL_AUCTION_SCHEDULE WHERE AS_START_DATE = '2024-05-04' ORDER BY AS_LOCATION_NUM ASC`,
        //DB.query(`SELECT * FROM TBL_AUCTION_SCHEDULE WHERE AS_START_DATE = DATE_ADD(CURDATE())`,
        [],
        (error, list) => {
            if(error){
                console.log(error);
            } else {
                console.log(list);
                if(list.length > 0) {
                    res.json(list);
                } else {
                    res.json('nolist')
                }
            }
        })
    },
    listProduct : (req, res) => {
        let grNo = req.query.grNo;
        DB.query(`SELECT * FROM TBL_GOODS_REGIST WHERE GR_NO = ?`, 
        [grNo],
        (error, product) => {
            if(error) {
                console.log(error);
            } else {
                console.log(product);
                DB.query(`SELECT GI_NAME FROM TBL_GOODS_IMG WHERE GR_NO = ?`,
                [grNo],
                (error, imgs) => {
                    if(error) {
                        console.log(error);
                    } 
                    const data = {
                        ...product[0],  
                        imgs: imgs.map(item => item.GI_NAME)
                    };
                    res.json(data);
                });
            }
        })
    },
    bidingInfo : (req, res) => {
        let grNo = req.query.grNo;

        DB.query(`SELECT * FROM TBL_AUCTION_CURRENT WHERE GR_NO = ? ORDER BY AC_REG_DATE ASC`, 
        [grNo],
        (error, result) => {
            if(error) {
                console.log(error);
            } else {
                res.json(result);
            }
        })
    },
    biding : (req, res) => {
        let grNo = req.query.grNo;
        let asPrice = req.query.asPrice;
        let mId = req.user;

        asPrice = Number(asPrice) + (asPrice*0.1);
        asPrice = Math.round(asPrice/100)  * 100
        console.log(asPrice);
        console.log(mId);

        DB.query(`SELECT MAX(AC_POINT) AS max_price FROM TBL_AUCTION_CURRENT WHERE GR_NO = ?`, 
        [grNo],
        (error, result) => {
            if(error) {
                console.log(error);
            } else {
                let maxPrice = result[0].max_price;
                if(asPrice > maxPrice) {
                    DB.query(`insert into TBL_AUCTION_CURRENT(m_id, ac_point, gr_no) values(?, ?, ?)`, 
                    [mId, asPrice, grNo],
                    (error, result) => {
                        if(error) {
                            console.log(error);
                        } else {
                            console.log(result);
                            res.json(result);
                        }
                    })
                } else {
                    res.json('fail');
                }
            }
        })
    },
    bidmsg: async (socketData, socket) => {
        let loglist = [];
        if (socketData.grNo !== '') {
            try {
                const result = await new Promise((resolve, reject) => {
                    DB.query(`SELECT * FROM TBL_AUCTION_CURRENT WHERE GR_NO = ? ORDER BY AC_REG_DATE ASC`,
                    [socketData.grNo],
                    (error, rows) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(rows);
                        }
                    });
                });
                loglist = result;
            } catch (error) {
                console.log(error);
            }
        }

        socket.broadcast.emit('bidmsg', {
            id : socketData.loginedId,
            bid : socketData.nextBid,
            price : socketData.nowPrice,
            log : loglist,
        });
    }
}

module.exports = auctionService;