const e = require('express');
const HomeDao = require('../dao/HomeDao');

module.exports = {
    getBidImg: async (req, res) => {
        console.log('[HOME SERVICE] getBidImg');

        try {

            const result = await HomeDao.getBidImgList();
            if (result.length > 0) {
                const formattedResult = result.map(row => ({ ...row }));
                res.json(formattedResult);

            }

        } catch (error) {
            console.log(error);
        }



    }
}