require('dotenv').config();
const fileRoute = require('express').Router();
const multer = require('multer');
const path = require('path');
const { v4: uuid4 } = require('uuid');
const fileModel = require('../models/fileModel');
const { response } = require('express');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
        cb(null, uniqueName);
    }
})

let upload = multer({
    storage,
    limits: { fileSize: 1000000 * 100 },
}).single('myfile');


fileRoute.post('/', (req, res) => {
    // Store file
    upload(req, res, async (err) => {

        if (!req.file) {
            return res.status(401).json({ error: "Please fill all data" })
        }

        if (err) {
            return res.status(402).json({ error: err.message })
        } else {
            const file = new fileModel({
                filename: req.file.filename,
                uuid: uuid4(),
                path: req.file.path,
                size: req.file.size
            })
            const response = await file.save();
            return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` })
            // "http://localhost:4000/files/7e4a97ce-f7e5-4ccf-8d65-8c41620f757f"
        }
    })
})

fileRoute.post('/send', async (req, res) => {
    const { uuid, emailTo, emailFrom } = req.body;
    if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).json({ error: "Please fill all data" })
    }

    const file = await fileModel.findOne({ uuid: uuid });
    if (file.sender) {
        return res.status(424).json({ error: "Email already has been sent" })
    }

    file.sender = emailFrom;
    file.receiver = emailTo;
    await file.save();

    const sendMail = require('../services/email');
    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'inShare file sharing',
        text: `${emailFrom} shared a file with you.`,
        html: require('../services/emailTemplate')({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size / 1000) + 'KB',
            expires: '24 hours'
        })
    });
    return res.json({ success: true })
})

module.exports = fileRoute;
