const fs = require('fs');
const keys_dir = './lib/config/key/'; // 키 파일이 위치
const ca = fs.readFileSync(keys_dir + 'ca_bundle.pem');
const key = fs.readFileSync(keys_dir + 'private.pem');
const cert = fs.readFileSync(keys_dir + 'certificate.pem');

module.exports.options = {
    key,
    cert,
    ca,
};
