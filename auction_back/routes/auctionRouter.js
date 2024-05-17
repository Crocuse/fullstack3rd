const express = require('express');
const auctionService = require('../lib/service/auctionService');
const router = express.Router();
const upload = require('../lib/config/uploads');



router.post('/regist_form', upload.UPLOAD_GOODS_MIDDLEWARE(), (req, res) => {
    console.log('/auction/regist_form');
    auctionService.goodsRegist(req, res);
});

router.get('/current_list', (req, res) => {
    console.log('/auction/current_list');
    auctionService.currentList(req, res);
});

router.get('/list_product', (req, res) => {
    console.log('/auction/list_product');
    auctionService.listProduct(req, res);
});

router.get('/bidingInfo', (req, res) => {
    console.log('/auction/bidingInfo');
    auctionService.bidingInfo(req, res);
});

router.get('/biding', (req, res) => {
    console.log('/auction/biding');
    auctionService.biding(req, res);
});

router.get('/asBiding', (req, res) => {
    console.log('/auction/asBiding');
    auctionService.asBiding(req, res);
});

router.get('/extend_level', (req, res) => {
    console.log('/auction/extend_level');
    auctionService.extendLevel(req, res);
});

router.get('/max_level_id_list', (req, res) => {
    console.log('/auction/max_level_id_list');
    auctionService.maxLevelIdList(req, res);
});

router.post('/endedAuction', (req, res) => {
    console.log('/auction/endedAuction');
    auctionService.endedAuction(req, res);
});

module.exports = router;

