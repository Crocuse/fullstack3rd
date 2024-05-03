const DB = require("../db/db");

const auctionService = {
    goodsRegist : (req, res) => {
        let post = req.body;
        let files = req.files;
        let mId = req.user;

        DB.query('INSERT INTO TBL_GOODS_REGIST(GR_NAME, GR_PRICE, GR_INFO, M_ID) VALUES(?, ?, ?, ?)', 
        [post.grName, post.grPrice, post.grInfo, 'gildong'],
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
    }
}

module.exports = auctionService;