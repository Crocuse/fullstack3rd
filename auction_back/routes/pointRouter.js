const express = require('express');
const pointService = require('../lib/service/pointService');
const router = express.Router();

router.post('/pointAddForm', (req,res) => {
    console.log('[pointRouter.js] /pointAddForm');
    pointService.getMyTotalPoint(req,res);
    
});
router.post("/getToken", async (req,res) => {
    console.log('[pointRouter.js] /getToken');
    // request의 body에서 imp_uid 추출
    const { imp_uid } = request.body;
    console.log( 'imp_uid=====>>',{imp_uid}) ;
    pointService.getToken(req,res);
  });

module.exports = router;