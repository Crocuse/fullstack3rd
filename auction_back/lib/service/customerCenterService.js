const DB = require('../db/db');

const customerCenterService = {
    qnaImgUpload: (req, res) => {
        const files = req.files;
        const fileUrls = files.map((file) => `/qna/${file.filename}`);
        res.json({ urls: fileUrls });
    },

    getQnaList: (req, res) => {
        let id = req.query.loginedId;
        DB.query('SELECT * FROM TBL_QNA WHERE M_ID = ?', [id], (err, list) => {
            if (err) {
                console.log(err);
                res.json(null);
                return;
            }
            res.json(list);
        });
    },

    insertQna: (req, res) => {
        let id = req.body.loginedId;
        let title = req.body.title;
        let html = req.body.editorData;

        DB.query('INSERT INTO TBL_QNA(M_ID, Q_TITLE, Q_HTML) VALUES(?, ?, ?)', [id, title, html], (err, rst) => {
            if (err) {
                console.log(err);
                res.json(false);
                return;
            }

            res.json(true);
        });
    },
};

module.exports = customerCenterService;
