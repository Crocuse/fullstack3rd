const DB = require('../db/db');

module.exports = {
    getMyPoint: (req, res) => {
        console.log('[pointService] getMyPoint()');
        const m_id = req.body.loginedId;
        console.log(m_id);

        DB.query(`SELECT P_CURRENT
                FROM TBL_POINT
                WHERE M_ID = ?
                ORDER BY P_REG_DATE DESC
                LIMIT 1;
                `,
            [m_id],
            (err, point) => {
                console.log('point', point);
                if (err) {
                    res.json(err);
                }
                if (point.length === 0) {
                    res.json({ message: "0" });
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
        DB.query(
            `SELECT P_CURRENT
             FROM TBL_POINT
             WHERE M_ID = ?
             ORDER BY P_REG_DATE DESC
             LIMIT 1`,
            [id],
            (err, result) => {
                if (err) {
                    res.json(err);
                    return;
                }

                if (result.length > 0) {
                    console.log('데이터 있을 때==>', id, chargeAmount, history);

                    currenPoint = result[0].P_CURRENT;
                    const updatedPoint = currenPoint + parseInt(chargeAmount);
                    DB.query(
                        `INSERT INTO TBL_POINT (M_ID, P_CHANGE, P_HISTORY, P_CURRENT, P_REG_DATE) 
                     VALUES (?, ?, ?, ?, NOW())`,
                        [id, chargeAmount, history, updatedPoint],
                        (err, result) => {
                            if (err) {
                                res.json(err);
                            } else {
                                res.json('success');
                            }
                        }
                    );
                } else {
                    console.log('데이터없을 때==>', id, chargeAmount, history);

                    let updatedPoint = chargeAmount;
                    console.log("updatedPoint--->>>", updatedPoint);
                    DB.query(`INSERT INTO TBL_POINT (M_ID, P_CHANGE, P_HISTORY, P_CURRENT, P_REG_DATE) 
                    VALUES (?, ?, ?, ?, NOW())`,
                        [id, chargeAmount, history, updatedPoint],
                        (err, result) => {
                            if (err) {
                                res.json(err);
                            } else {
                                res.json('success');
                            }
                        })
                }


            }
        );
    }

}