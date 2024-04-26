const express = require('express');
<<<<<<< HEAD
const adminService = require('../lib/sevice/adminService');
=======
const adminService = require('../lib/service/adminService');
>>>>>>> c57c2a621bb9a5afec868519eaf68ca9a70290e3
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

