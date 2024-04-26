const express = require('express');
const auctionService = require('../lib/service/auctionService');
const router = express.Router();


router.post('/regist_form', (req, res) => {
    console.log('/auction/regist_form');
});


module.exports = router;

