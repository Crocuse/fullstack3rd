const DB = require("../db/db");

const auctionService = {
    goods_regist : (req, res) => {
        let post = req.body;

        DB.query('insert into tbl_goods_regist(GR_NAME, gr_price, gr_info, M_ID)', 
        [post.grName, post.grPrice, post.grInfo, 'id'],
        (error, result) => {
            if(error){
                console.log(error)
            } else {
                //등록 넘버를 외래키로 테이블 하나 더 추가.
                //실패하면 업로드 X
                //성공하면 업로드 O
                //이미지 업로드.
            }
        })
    }


}

module.exports = auctionService;