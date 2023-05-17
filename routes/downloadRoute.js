require('dotenv').config();
const router = require('express').Router();
const fileModel = require('../models/fileModel');

router.get('/:uuid', async (req, res) => {
    try {
        const file = await fileModel.findOne({ uuid: req.params.uuid });
        if (!file) {
            return res.render('download', { error: 'Link has been expired' });
        }
        const filePath = `${__dirname}/../${file.path}`;
        res.download(filePath);
    } catch (e) {
        console.log(e.message);
    }
})

module.exports = router;
