const DB = require('../db/db');

module.exports = {
    getMyTotalPoint: (req, res) => {
        console.log('[pointService] getMyTotalPoint()');
        const m_id = req.body.loginedId;
        console.log(m_id);
        DB.query(`SELECT * FROM TBL_POINT M_ID = ?`,
            [m_id],
            (err, point) => {
                console.log('point', point);
                if (point === undefined) {
                    res.json('undefind');

                } else {
                    res.json('error');
                }
            })
    },
}