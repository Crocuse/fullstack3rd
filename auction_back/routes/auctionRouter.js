const express = require('express');
const auctionService = require('../lib/service/auctionService');
const router = express.Router();
const upload = require('../lib/config/uploads');



router.post('/regist_form', upload.UPLOAD_GOODS_MIDDLEWARE(), (req, res) => {
    console.log('/auction/regist_form');
    
    console.log(req.body);
    console.log(req.files);

    auctionService.goods_regist(req, res);
});


module.exports = router;

