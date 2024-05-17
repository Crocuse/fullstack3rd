const DB = require('../db/db');

const customerCenterDao = {
    getQnaList: (req) => {
        return new Promise((resolve, reject) => {
            let id = req.query.loginedId;
            DB.query('SELECT * FROM TBL_QNA WHERE M_ID = ? ORDER BY Q_NO DESC', [id], (err, list) => {
                if (err) {
                    console.log(err);
                    resolve(null);
                    return;
                }
                resolve(list);
            });
        });
    },

    insertQna: (req) => {
        return new Promise((resolve, reject) => {
            let id = req.body.loginedId;
            let title = req.body.title;
            let html = req.body.editorData;

            DB.query('INSERT INTO TBL_QNA(M_ID, Q_TITLE, Q_HTML) VALUES(?, ?, ?)', [id, title, html], (err, rst) => {
                if (err) {
                    console.log(err);
                    resolve(false);
                    return;
                }

                resolve(true);
            });
        });
    },
};

module.exports = customerCenterDao;
