const DB = require('../db/db');

module.exports = {
    getBidImgList: (req, res) => {
        console.log('[HOME DAO] getBidImgList');

        return new Promise((resolve, reject) => {

            DB.query(`SELECT 
            ac.GR_NO,
            MIN(gi.GI_NAME) AS GI_NAME
        FROM 
            TBL_AUCTION_CURRENT ac
        JOIN 
            TBL_GOODS_IMG gi ON ac.GR_NO = gi.GR_NO
        WHERE 
            DATE(ac.AC_REG_DATE) = CURDATE()
        GROUP BY 
            ac.GR_NO;
         `,
                (err, imgList) => {
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