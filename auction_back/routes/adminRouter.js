const express = require('express');
const adminService = require('../lib/sevice/adminService');
const router = express.Router();


router.post('/admin_regist_confirm', (req, res) => {
    console.log('/admin_regist_confirm');
    adminService.adminRegistConfirm(req, res);
});

module.exports = router;

