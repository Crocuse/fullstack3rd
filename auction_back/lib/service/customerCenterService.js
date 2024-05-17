const customerCenterDao = require('../dao/CustomerCenterDao');
const DB = require('../db/db');

const customerCenterService = {
    qnaImgUpload: (req, res) => {
        const files = req.files;
        const fileUrls = files.map((file) => `/qna/${file.filename}`);
        res.json({ urls: fileUrls });
    },

    getQnaList: async (req, res) => {
        let result = await customerCenterDao.getQnaList(req);
        res.json(result);
    },

    insertQna: async (req, res) => {
        let result = await customerCenterDao.insertQna(req);
        res.json(result);
    },
};

module.exports = customerCenterService;
