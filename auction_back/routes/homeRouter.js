const express = require('express');
const router = express.Router();

router.get('/bidImg', (req, res) => {
    console.log("[HOME ROUTER] /bidImg");
    return null;
});
module.exports = router;