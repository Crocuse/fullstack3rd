const DB = require("../db/db");

const auctionService = {
    goods_regist : (req, res) => {
        let post = req.body;
        let files = req.files;
        let mId = req.user;

        console.log('mId', mId);

        DB.query('INSERT INTO TBL_GOODS_REGIST(GR_NAME, GR_PRICE, GR_INFO, M_ID) VALUES(?, ?, ?, ?)', 
        [post.grName, post.grPrice, post.grInfo, 'gildong'],
        (error, result) => {
            if(error){
                console.log(error)
                for(let i = 0; i < files.length; i++) {
                    fs.unlink(`C:/ysw/${req.file.filename}`, (error) => {
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
    }
}

module.exports = auctionService;