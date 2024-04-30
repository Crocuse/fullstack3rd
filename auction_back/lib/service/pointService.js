const DB = require('../db/db');

module.exports = {
    getMyPoint: (req, res) => {
        console.log('[pointService] getMyPoint()');
        const m_id = req.body.loginedId;
        console.log(m_id);

        DB.query(`SELECT P_CURRENT FROM TBL_POINT WHERE M_ID = ?`,
            [m_id],
            (err, point) => {
                console.log('point', point);
                if (point.length === 0 || err) {
                    res.json({ message: "error" });
                    return;
                }

                if (point.length > 0) {
                    const currentPoint = point[0].P_CURRENT;
                    console.log('currentPoint:', currentPoint);
                    res.json({ currentPoint });
                }
            })
    },
    setPointInfo: (req, res) => {
        console.log('[pointService] setPointInfo()');
        const id = req.body.loginedId;
        const chargeAmount = req.body.chargeAmount;
        const history = req.body.history;
        console.log('info', id, chargeAmount, history);
        DB.query(`SELECT P_CURRENT FROM TBL_POINT WHERE M_ID = ?`,
            [id],
            (err, info) => {
                if (err) {
                    res.json(err);
                    return;
                }

                if (info.length === 0) {
                    const currentPoint = chargeAmount;
                    DB.query(`INSERT INTO TBL_POINT (M_ID, P_CHANGE, P_HISTORY, P_CURRENT, P_REG_DATE) 
                        VALUES(?, ?, ?, ?, NOW())`,
                        [id, chargeAmount, history, currentPoint],
                        (err, result) => {
                            if (err) {
                                res.json(err);

                            } else {
                                res.json('success');
                            }
                        })
                }

                if (info.length > 0) {
                    DB.query(`UPDATE TBL_POINT
                    SET 
                        P_CHANGE = ?,
                        P_HISTORY = ?,
                        P_CURRENT = P_CURRENT + ?,
                        P_REG_DATE = NOW()
                    WHERE M_ID = ?`,
                        [chargeAmount, history, chargeAmount, id],
                        (err, result) => {
                            if (err) {
                                res.json(err);

                            } else {
                                res.json('success');
                            }
                        })
                }
            })

    }
}