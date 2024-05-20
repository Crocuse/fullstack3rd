const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uuid4 = require('uuid4');
const os = require('os');

const uploads = {
    UPLOAD_GOODS_MIDDLEWARE: () => {
        const upload = multer({
            storage: multer.diskStorage({
                destination(req, files, done) {
                    let fileDir = '';
                    if (os.version().includes('Windows')) {
                        fileDir = 'C:/auction/goodsImg/';
                    } else {
                        fileDir = '/home/ubuntu/auction/goodsImg';
                    }

                    if (!fs.existsSync(fileDir)) {
                        fs.mkdirSync(fileDir, { recursive: true });
                    }
                    done(null, fileDir);
                },
                filename(req, file, done) {
                    const extName = path.extname(file.originalname);
                    const fileName = uuid4() + extName;
                    done(null, fileName);
                },
            }),
            limits: {
                fileSize: 3 * 1024 * 1024,
            },
        });

        return upload.array('gr_imgs');
    },

    UPLOAD_QNA_MIDDLEWARE: () => {
        const upload = multer({
            storage: multer.diskStorage({
                destination(req, files, done) {
                    let fileDir = '';
                    if (os.version().includes('Windows')) {
                        fileDir = 'C:/auction/qna';
                    } else {
                        fileDir = '/home/ubuntu/auction/qna';
                    }

                    if (!fs.existsSync(fileDir)) {
                        fs.mkdirSync(fileDir, { recursive: true });
                    }
                    done(null, fileDir);
                },
                filename(req, file, done) {
                    const extName = path.extname(file.originalname);
                    const fileName = uuid4() + extName;
                    done(null, fileName);
                },
            }),
            limits: {
                fileSize: 3 * 1024 * 1024,
            },
        });

        return upload.array('imgs');
    },
};

module.exports = uploads;
