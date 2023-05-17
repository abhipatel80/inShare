require('dotenv').config();
const router = require('express').Router();
const fileModel = require('../models/fileModel');

router.get('/:uuid', async (req, res) => {
    try {
        const file = await fileModel.findOne({ uuid: req.params.uuid });
        if (!file) {
            return res.render('download', { error: 'Link has been expired' });
        }
        return res.render('download', {
            uuid: file.uuid,
            fileName: file.filename,
            fileSize: file.size,
            downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
            // "http://localhost:4000/files/download/7e4a97ce-f7e5-4ccf-8d65-8c41620f757f"
        })
    } catch (e) {
        console.log(e.message);
        return res.render('download', { error: 'Something went wrong' });
    }
})

module.exports = router;
