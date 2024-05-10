const express = require('express');
const { UPLOAD_QNA_MIDDLEWARE } = require('../lib/config/uploads');
const router = express.Router();
const customerCenterService = require('../lib/service/customerCenterService');

router.post('/qna_img_upload', UPLOAD_QNA_MIDDLEWARE(), (req, res) => {
    customerCenterService.qnaImgUpload(req, res);
});

router.get('/QnaList', (req, res) => {
    customerCenterService.getQnaList(req, res);
});

router.post('/qna', (req, res) => {
    customerCenterService.insertQna(req, res);
});

module.exports = router;
