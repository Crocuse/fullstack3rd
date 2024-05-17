const express = require('express');
const pointService = require('../lib/service/pointService');
const router = express.Router();

router.post('/getMyPoint', (req, res) => {
  console.log('[pointRouter.js] /getMyPoint');

  pointService.getMyPoint(req, res);

});

router.post("/setPointInfo", (req, res) => {
  console.log('[pointRouter.js] /setPointInfo');

  pointService.setPointInfo(req, res);
});

module.exports = router;