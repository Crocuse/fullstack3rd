const express = require('express');
const pointService = require('../lib/service/pointService');
const router = express.Router();

router.post('/pointAddForm', (req, res) => {
  console.log('[pointRouter.js] /pointAddForm');
  console.log('req.body', req.body);
  pointService.getMyTotalPoint(req, res);

});

router.post("/certifications", async (req, res) => {
  console.log('[pointRouter.js] /certifications');
  // request의 body에서 imp_uid 추출
  console.log('req.body   : ', req.body);
  console.log('req.data     : ', req.data);
  const { imp_uid } = req.data;
  console.log('imp_uid=====>>', { imp_uid });
  pointService.getToken(req, res);
});

module.exports = router;