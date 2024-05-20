const express = require('express');
const router = express.Router();
const HomeService = require('../lib/service/homeService');

router.get('/bidImg', (req, res) => {
    console.log("[HOME ROUTER] /bidImg");
    HomeService.getBidImg(req, res);
});
module.exports = router;