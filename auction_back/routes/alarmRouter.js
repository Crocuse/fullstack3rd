const express = require('express');
const router = express.Router();

router.post('/alarmInfo', (req, res) => {
    console.log("[ALARM ROUTER] /alarmInfo ");
});

module.exports = router;