const express = require('express');
const pointService = require('../lib/service/pointService');
const router = express.Router();

router.post('/pointAddForm', (req,res) => {
    console.log('[pointRouter.js] /pointAddForm');
    pointService.getMyTotalPoint(req,res);

});

module.exports = router;