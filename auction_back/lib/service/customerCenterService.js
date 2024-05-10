const customerCenterService = {
    qnaImgUpload: (req, res) => {
        const files = req.files;
        const fileUrls = files.map((file) => `/qna/${file.filename}`);
        res.json({ urls: fileUrls });
    },
};

module.exports = customerCenterService;
