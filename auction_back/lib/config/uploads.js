const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid4');

const uploads = {
    UPLOAD_GOODS_MIDDLEWARE: () => {
        const upload = multer({
            storage: multer.diskStorage({
                destination(req, file, done) {
                    let fileDir = `/home/ubuntu/acution/goodsImg/`;
                    if(!fs.existsSync(fileDir)) {
                        fs.mkdirSync(fileDir, {recursive: true});
                    }
                    done(null, `/home/ubuntu/acution/goodsImg/`);
                },
                filename(req, file, done) {
                    let uuid4 = uuid4();
                    let extName = path.extname(file.originalname);
                    let fileName = uuid + extName;
                    done(null, fileName);
                }
            }),
            limits : {
                fileSize: 3*1024*1024,
            }
        })

        return upload.array(req.body.files)
    }
}

module.exports = uploads;