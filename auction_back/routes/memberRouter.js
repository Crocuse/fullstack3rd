const express = require('express');
const memberService = require('../lib/service/memberService');
const router = express.Router();

router.get('/is_member', (req, res) => {
    memberService.isMember(req, res);
})

router.post('/is_mail', (req, res) => {
    memberService.isMail(req, res);
})

router.post('/signup_confirm', (req, res) => {
    memberService.signupConfirm(req, res);
})

router.get('/login_success', (req, res) => {
    memberService.loginSuccess(req, res);
})

router.get('/login_fail', (req, res) => {
    memberService.loginFail(req, res);
})

router.get('/logout_confirm', (req, res) => {
    memberService.logoutConfirm(req, res);
})

module.exports = router;