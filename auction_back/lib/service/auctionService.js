const DB = require("../db/db");

const auctionService = {
    goods_regist : (req, res) => {
        let post = req.body;
        let files = req.files;

        // DB.query('INSERT INTO TBL_GOODS_REGIST(GR_NAME, GR_PRICE, GR_INFO, M_ID) VALUES(?, ?, ?, ?)', 
        // [post.grName, post.grPrice, post.grInfo, 'id'],
        // (error, result) => {
        //     if(error){
        //         console.log(error)
        //     } else {
        //         for(let i = 0; i < post.files.length; i++) {
                    
        //         }
        //         //등록 넘버를 외래키로 테이블 하나 더 추가.
        //         //실패하면 업로드 X
        //         //성공하면 업로드 O
        //         //이미지 업로드.
        //     }
        // })
    }


}

module.exports = auctionService;