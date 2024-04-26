const express = require('express');
const adminService = require('../lib/service/adminService');
const router = express.Router();


router.post('/admin_regist_confirm', (req, res) => {
    console.log('/admin_regist_confirm');
    adminService.adminRegistConfirm(req, res);
});

router.get('/is_member', (req, res) => {
    adminService.isMember(req, res);
});

router.post('/is_mail', (req, res) => {
    adminService.isMail(req, res);
});

module.exports = router;

