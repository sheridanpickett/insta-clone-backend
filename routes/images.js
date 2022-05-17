const express = require('express');
const multer = require('multer');
const { v4: uuid } = require('uuid');
const { client } = require('../postgres');
const { uploadFile, getFile, deleteFile } =  require('../s3');

const router = express.Router();
const upload = multer();

router.get('/', async (req, res) => {
    const images = await client.query('SELECT * FROM images');
    res.json(images.rows);
})

router.post('/', upload.single('imageFile'), async (req, res) => {
    const file = req.file;
    const objectKey = uuid();

    try {
        await uploadFile(file, objectKey);
        await client.query(`INSERT INTO images (key) VALUES ('${objectKey}')`);
        res.sendStatus(200);
    } catch(err) {
        console.log(err)
        res.sendStatus(500);
    }
})

router.get('/allImageKeys', async (req, res) => {
    try {
        let imageKeys = await client.query(`SELECT file_key FROM images`);
        imageKeys = imageKeys.rows.map(imageKey=>imageKey.file_key);
        res.send(imageKeys);
    } catch(err) {
        console.log(err);
    }
})

router.get('/:key', async (req, res) => {
    try {
        const file = await getFile(req.params.key);
        file.Body.pipe(res);
    } catch(err) {
        res.sendStatus(500);
    }
})

router.delete('/:key', async (req, res) => {
    try {
        await deleteFile(req.params.key);
        res.sendStatus(200);
    } catch(err) {
        res.sendStatus(500);
    }
})

module.exports = router;