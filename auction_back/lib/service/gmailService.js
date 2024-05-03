const nodemailer = require('nodemailer');
const senderInfo = require('../config/mailInfo.json');

const mailSender = {
    // 메일발송 함수
    sendGmail: function (toEmail, subject, htmlContent) {
        console.log('🚀 ~ senderInfo.gmail.email_service:', senderInfo.gmail.email_service);
        console.log('🚀 ~ senderInfo.pass:', senderInfo.pass);
        console.log('🚀 ~ senderInfo.user:', senderInfo.user);

        let transporter = nodemailer.createTransport({
            service: senderInfo.gmail.email_service, // 메일 보내는 곳
            auth: {
                user: senderInfo.gmail.user, // 보내는 메일의 주소
                pass: senderInfo.gmail.pass, // 보내는 메일의 비밀번호
            },
        });

        // 메일 옵션
        let mailOptions = {
            from: senderInfo.user, // 보내는 메일의 주소
            to: toEmail, // 수신할 이메일
            subject: subject, // 메일 제목
            html: htmlContent, // 메일 내용 (HTML 코드)
        };

        // 메일 발송
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    },
};

module.exports = mailSender;
