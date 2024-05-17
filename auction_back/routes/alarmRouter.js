const express = require('express');
const router = express.Router();
const alarmService = require('../lib/service/alarmService');

router.post('/alarmInfo', (req, res) => {
    console.log("[ALARM ROUTER] /alarmInfo ");
    alarmService.alarmInfo(req, res);
});

router.put('/alarmReadState', (req, res) => {
    console.log('[ALARM ROUTER] /alarmReadState');
    alarmService.putAlarmReadState(req,res);
})

module.exports = router;