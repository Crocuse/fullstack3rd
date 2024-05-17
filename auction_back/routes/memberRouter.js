const express = require('express');
const memberService = require('../lib/service/memberService');
const uploads = require('../lib/config/uploads');
const router = express.Router();

router.post('/session_check', (req, res) => {
    memberService.sessionCheck(req, res);
});

router.get('/is_member', (req, res) => {
    memberService.isMember(req, res);
});

router.post('/is_mail', (req, res) => {
    memberService.isMail(req, res);
});

router.post('/mail_code_send', (req, res) => {
    memberService.mailCodeSend(req, res);
});

router.post('/signup_confirm', (req, res) => {
    memberService.signupConfirm(req, res);
});

router.get('/google_login', (req, res) => {
    memberService.googleLogin(req, res);
});

router.get('/naver_login', (req, res) => {
    memberService.naverLogin(req, res);
});

router.get('/kakao_login', (req, res) => {
    memberService.kakaoLogin(req, res);
});

router.get('/login_success', (req, res) => {
    memberService.loginSuccess(req, res);
});

router.get('/login_fail', (req, res) => {
    memberService.loginFail(req, res);
});

router.get('/get_my_info', (req, res) => {
    memberService.getMyInfo(req, res);
});

router.post('/modify_phone', (req, res) => {
    memberService.modifyPhone(req, res);
});

router.post('/modify_addr', (req, res) => {
    memberService.modifyAddr(req, res);
});

router.post('/check_password', (req, res) => {
    memberService.checkPassword(req, res);
});

router.get('/social_id_check', (req, res) => {
    memberService.socialIdCheck(req, res);
});

router.put('/modify_password', (req, res) => {
    console.log('/modify_password');
    memberService.modifyPassword(req, res);
});

router.post('/get_my_regist_list', (req, res) => {
    memberService.getMyRegistList(req, res);
});

router.get('/cancel_goods', (req, res) => {
    memberService.cancelGoods(req, res);
});

router.post('/get_my_sells', (req, res) => {
    memberService.getMySells(req, res);
});

router.post('/get_my_winnigs', (req, res) => {
    memberService.getMyWinnigs(req, res);
});

router.post('/get_my_point_history', (req, res) => {
    memberService.getMyPointHistory(req, res);
});

router.get('/logout_confirm', (req, res) => {
    memberService.logoutConfirm(req, res);
});

router.get('/find_id', (req, res) => {
    memberService.findId(req, res);
});

router.get('/find_pw', (req, res) => {
    memberService.findPw(req, res);
});

router.get('/delete', (req, res) => {
    memberService.memberDelete(req, res);
});

router.get('/modify_goods_select',(req,res)=>{
    memberService.modifyGoodsSelect(req,res);
});

router.post('/modify_goods_confirm',uploads.UPLOAD_GOODS_MIDDLEWARE(),(req,res)=>{
    memberService.modifyGoodsConfirm(req,res);
})

module.exports = router;
