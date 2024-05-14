const DB = require('../db/db');
const bcrypt = require('bcrypt');
const google = require('../config/google.json');
const naver = require('../config/naver.json');
const kakao = require('../config/kakao.json');
const mailService = require('./gmailService');
const generateTemp = require('../util/uuidGenerator');
const MemberDao = require('../dao/MemberDao');

const memberService = {
    sessionCheck: (req, res) => {
        let sessionId = req.body.sessionId;

        if (req.sessionID == sessionId) {
            res.json('session correct');
        } else {
            res.json('session incorrect');
        }
    },

    isMember: async (req, res) => {
        let result = await MemberDao.isMember(req.query.id);
        res.json(result);
    },

    isMail: async (req, res) => {
        let result = await MemberDao.isMail(req.body.mail);
        res.json(result);
    },

    mailCodeSend: (req, res) => {
        let mail = req.body.mail;
        let subject = `[비드버드] 회원가입 이메일 인증 코드입니다.`;
        let code = generateTemp(6);

        let title = '이메일 인증 안내';
        let text = `안녕하세요. 비드버드를 이용해주셔서 감사드립니다. <br />
        회원가입 화면에서 다음 코드를 이용하여 메일 인증을 완료해주세요.`;
        let html = mailService.generateCodeHTML(title, text, code);

        mailService.sendGmail(mail, subject, html);

        res.json(code);
    },

    signupConfirm: async (req, res) => {
        let post = req.body;
        let result = await MemberDao.signupConfirm(post);
        res.json(result);
    },

    googleLogin: (req, res) => {
        const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=${encodeURIComponent(
            'http://localhost:3000/auth/google/callback'
        )}&scope=https://www.googleapis.com/auth/plus.login email&client_id=${google.web.client_id}`;
        res.json({ url: googleAuthURL });
    },

    naverLogin: (req, res) => {
        const naverAuthURL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${
            naver.web.client_id
        }&redirect_uri=${encodeURIComponent(naver.web.redirect_uri)}`;
        res.json({ url: naverAuthURL });
    },

    kakaoLogin: (req, res) => {
        const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${
            kakao.web.client_id
        }&redirect_uri=${encodeURIComponent(kakao.web.redirect_uri)}`;
        res.json({ url: kakaoAuthURL });
    },

    loginSuccess: async (req, res) => {
        if (req.user == 'super') {
            res.json({
                sessionID: req.sessionID,
                loginedId: req.user,
                loginedAdmin: 'super',
            });
            return;
        }
        let result = await MemberDao.loginSuccess(req);
        res.json(result);
    },

    loginFail: (req, res) => {
        res.json({
            error: req.flash('error'),
        });
    },

    getMyInfo: async (req, res) => {
        let result = await MemberDao.getMyInfo(req);

        const selectedMember = {
            ...result.member[0],
            M_ADDR: result.member[0].M_ADDR.replace(/\//g, ' '),
            M_ID:
                result.member[0].M_ID.slice(0, 2) === 'N_'
                    ? '네이버 로그인 회원입니다.'
                    : result.member[0].M_ID.slice(0, 2) === 'G_'
                    ? '구글 로그인 회원입니다.'
                    : result.member[0].M_ID.slice(0, 2) === 'K_'
                    ? '카카오톡 로그인 회원입니다.'
                    : result.member[0].M_ID,
            M_SOCIAL_ID:
                result.member[0].M_SOCIAL_ID === null
                    ? '소셜 로그인 회원이 아닙니다.'
                    : result.member[0].M_SOCIAL_ID.slice(0, 2) === 'N_'
                    ? '네이버 로그인 회원입니다.'
                    : result.member[0].M_SOCIAL_ID.slice(0, 2) === 'G_'
                    ? '구글 로그인 회원입니다.'
                    : result.member[0].M_SOCIAL_ID.slice(0, 2) === 'K_'
                    ? '카카오톡 로그인 회원입니다.'
                    : '소셜 로그인 회원이 아닙니다.',
        };
        let currentPoint = 0;
        if (result.point.length != 0) currentPoint = result.point[0].P_CURRENT;
        res.json({ selectedMember, currentPoint });
    },

    modifyPhone: async (req, res) => {
        let result = await MemberDao.modifyPhone(req);
        res.json(result);
    },

    modifyAddr: async (req, res) => {
        let result = await MemberDao.modifyAddr(req);
        res.json(result);
    },

    checkPassword: async (req, res) => {
        let result = await MemberDao.checkPassword(req);
        res.json(result);
    },

    socialIdCheck: async (req, res) => {
        let result = await MemberDao.socialIdCheck(req);
        res.json(result);
    },

    modifyPassword: async (req, res) => {
        let result = await MemberDao.modifyPassword(req);
        res.json(result);
    },

    getMyRegistList: async (req, res) => {
        let result = await MemberDao.getMyRegistList(req);
        res.json(result);
    },

    cancelGoods: async (req, res) => {
        let result = await MemberDao.cancelGoods(req);
        res.json(result);
    },

    getMySells: async (req, res) => {
        let result = await MemberDao.getMySells(req);
        res.json(result);
    },

    getMyWinnigs: async (req, res) => {
        let result = await MemberDao.getMyWinnigs(req);
        res.json(result);
    },

    getMyPointHistory: async (req, res) => {
        let result = await MemberDao.getMyPointHistory(req);
        res.json(result);
    },

    logoutConfirm: (req, res) => {
        req.logout(() => {
            res.json('logout');
        });
    },

    findId: async (req, res) => {
        let m_id = await MemberDao.findId(req);

        if (m_id === null) {
            res.json('error');
            return;
        }

        if (m_id.length === 0) {
            res.json('not_found');
        } else if (m_id[0].M_ID.slice(0, 2) === 'G_') {
            res.json('google_id');
        } else if (m_id[0].M_ID.slice(0, 2) === 'N_') {
            res.json('naver_id');
        } else if (m_id[0].M_ID.slice(0, 2) === 'K_') {
            res.json('kakao_id');
        } else {
            let mail = req.body.mail;
            let subject = `[비드버드] 회원님의 아이디 정보입니다.`;
            let title = `아이디 정보 안내`;
            let text = `안녕하세요. 비드버드를 이용해주셔서 감사드립니다. <br />
            회원님의 아이디 찾기 결과를 보내드립니다. <br />
            비밀번호를 잊어버린 경우 비밀번호 찾기를 이용해주세요.`;
            let code = `${m_id[0].M_ID}`;
            let html = mailService.generateCodeHTML(title, text, code);

            mailService.sendGmail(mail, subject, html);
            res.json('mail_send');
        }
    },

    findPw: async (req, res) => {
        let mail = req.body.mail;
        let m_id = await MemberDao.findId(req);

        if (m_id === null) {
            res.json('error');
            return;
        }

        if (m_id.length === 0) {
            res.json('not_found');
        } else if (m_id[0].M_ID.slice(0, 2) === 'G_') {
            res.json('google_id');
        } else if (m_id[0].M_ID.slice(0, 2) === 'N_') {
            res.json('naver_id');
        } else {
            // 임시 비밀번호 생성 (8자리)
            let newPw = generateTemp(8);

            req.body.pw = newPw;
            let modifyRst = await MemberDao.modifyPassword(req);

            if (modifyRst === 'error') {
                res.json('error');
                return;
            }

            let subject = `[비드버드] 회원님의 임시 비밀번호입니다.`;
            let title = `임시 비밀번호 안내`;
            let text = `안녕하세요. 비드버드를 이용해주셔서 감사드립니다. <br />
            회원님의 계정 임시 비밀번호를 보내드립니다. <br />
            로그인 후 보안을 위해 마이페이지 - 비밀번호 변경에서 비밀번호를 변경해주세요.`;
            let html = mailService.generateCodeHTML(title, text, newPw);

            mailService.sendGmail(mail, subject, html);
            res.json('mail_send');
        }
    },

    memberDelete: async (req, res) => {
        let result = await MemberDao.memberDelete(req);
        res.json(result);
    },
};

module.exports = memberService;
