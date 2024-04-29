const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uuid4 = require('uuid4');

const uploads = {
    UPLOAD_GOODS_MIDDLEWARE: () => {
        const upload = multer({
            storage: multer.diskStorage({
                destination(req, files, done) {
                    //let fileDir = `/home/ubuntu/acution/goodsImg/`;
                    let fileDir = 'C:/ysw/';
                    if(!fs.existsSync(fileDir)) {
                        fs.mkdirSync(fileDir, {recursive: true});
                    }
                    done(null, fileDir);
                },
                filename(req, file, done) {
                    const extName = path.extname(file.originalname);
                    const fileName = uuid4() + extName;
                    done(null, fileName);
                }
            }),
            limits : {
                fileSize: 3*1024*1024,
            }
        })

        return upload.array('gr_imgs')
    }
}

module.exports = uploads;