const express = require('express');
const memberService = require('../lib/service/memberService');
const router = express.Router();

router.post('/session_check', (req, res) => {
    memberService.sessionCheck(req, res);
})

router.get('/is_member', (req, res) => {
    memberService.isMember(req, res);
})

router.post('/is_mail', (req, res) => {
    memberService.isMail(req, res);
})

router.post('/signup_confirm', (req, res) => {
    memberService.signupConfirm(req, res);
})

router.get('/google_login', (req, res) => {
    memberService.googleLogin(req, res);
})

router.get('/naver_login', (req, res) => {
    console.log('naver_login')
    memberService.naverLogin(req, res);
})

router.get('/login_success', (req, res) => {
    memberService.loginSuccess(req, res);
})

router.get('/login_fail', (req, res) => {
    memberService.loginFail(req, res);
})

router.get('/get_my_info', (req, res) => {
    memberService.getMyInfo(req, res);
})

router.post('/modify_phone', (req, res) => {
    memberService.modifyPhone(req, res);
})

router.post('/modify_addr', (req, res) => {
    memberService.modifyAddr(req, res);
})

router.post('/check_password', (req, res) => {
    memberService.checkPassword(req, res)
})

router.post('/modify_password', (req, res) => {
    memberService.modifyPassword(req, res)
})

router.get('/logout_confirm', (req, res) => {
    console.log('/logout_confirm')
    memberService.logoutConfirm(req, res);
})

module.exports = router;