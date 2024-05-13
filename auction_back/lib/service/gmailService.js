const nodemailer = require('nodemailer');
const senderInfo = require('../config/mailInfo.json');

const mailSender = {
    // html 생성
    generateCodeHTML: (title, text, code) => {
        return `
            <div
                style="
                max-width: 600px;
                padding: 20px;
                background-color: #f5f5f5;
                border-radius: 5px;
                text-align: center;
            "
            >
                <img src="https://i.imgur.com/D3lJNvg.png" style="max-width: 100%;"/>
                <h3 style="font-size: 24px; margin-top:20px; margin-bottom: 20px">${title}</h3>
                <div style="font-size: 16px; line-height: 1.5; margin-bottom: 20px">
                    ${text}
                </div>
                <div
                    style="
                    background-color: #ffffff;
                    border: 1px solid #dddddd;
                    border-radius: 5px;
                    padding: 20px;
                    font-size: 20px;
                    font-weight: bold;
                "
                >
                    코드: <span style="color: #ff6600">${code}</span>
                </div>
            </div>
        `;
    },

    // 메일발송 함수
    sendGmail: (toEmail, subject, htmlContent) => {
        let transporter = nodemailer.createTransport({
            service: senderInfo.gmail.email_service, // 메일 보내는 곳
            auth: {
                user: senderInfo.gmail.user, // 보내는 메일의 주소
                pass: senderInfo.gmail.pass, // 보내는 메일의 비밀번호
            },
        });

        // 메일 옵션
        let mailOptions = {
            from: '"비드버드" <' + senderInfo.gmail.user + '>', // 보내는 메일의 주소
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
