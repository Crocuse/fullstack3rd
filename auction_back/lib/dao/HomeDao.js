const DB = require('../db/db');

module.exports = {
    getBidImgList: (req, res) => {
        console.log('[HOME DAO] getBidImgList');

        return new Promise((resolve, reject) => {

            DB.query(`SELECT 
            sch.GR_NO,
            MIN(gi.GI_NAME) AS GI_NAME
        FROM 
            TBL_AUCTION_SCHEDULE sch
        JOIN 
            TBL_GOODS_IMG gi ON sch.GR_NO = gi.GR_NO
        WHERE 
            sch.AS_START_DATE = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
        GROUP BY 
            sch.GR_NO;
        `,
                (err, imgList) => {
                    console.log('이미지 리스트---->', imgList)
                    if (err) {
                        reject(err);
                    }
                    if (imgList) {
                        resolve(imgList);
                    }
                });
        });

    }
}