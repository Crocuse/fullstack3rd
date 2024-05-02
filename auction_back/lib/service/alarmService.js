const DB = require('../db/db');

module.exports = {
    getAcPointInfo: (req, res) => {
        console.log("[ALARMSERVICE] getAcPointInfo()");
        DB.query(`SELECT AC_POINT FROM TBL_AUCTION_CURRENT WHERE M_ID = ?`,
            [req.loginedId],
            (err, result) => {
                if (err) {
                    res.json({ message: "err" });
                    return;
                }

                if (result.length > 0) {
                    const acPoint = result[0].AC_POINT;
                    res.json({ acPoint });
                }
            })
    },
}