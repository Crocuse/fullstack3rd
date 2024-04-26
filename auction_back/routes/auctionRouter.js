const express = require('express');
const auctionService = require('../lib/service/auctionService');
const router = express.Router();
const upload = require('../lib/config/uploads');



router.post('/regist_form', (req, res) => {
    console.log('/auction/regist_form');
    auctionService.goods_regist(req, res);
});


module.exports = router;

