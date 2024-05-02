const express = require('express');
const auctionService = require('../lib/service/auctionService');
const router = express.Router();
const upload = require('../lib/config/uploads');



router.post('/regist_form', upload.UPLOAD_GOODS_MIDDLEWARE(), (req, res) => {
    console.log('/auction/regist_form');
    auctionService.goodsRegist(req, res);
});

router.get('/current_list', upload.UPLOAD_GOODS_MIDDLEWARE(), (req, res) => {
    console.log('/auction/current_list');
    auctionService.currentList(req, res);
});

router.get('/list_product', upload.UPLOAD_GOODS_MIDDLEWARE(), (req, res) => {
    console.log('/auction/list_product');
    auctionService.listProduct(req, res);
});


module.exports = router;

