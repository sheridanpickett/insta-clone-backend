const express = require('express');
const multer = require('multer');
const { v4: uuid } = require('uuid');
const { client } = require('../postgres');
const { uploadFile, getFile, deleteFile } =  require('../s3');

const router = express.Router();
const upload = multer();

router.get('/', async (req, res) => {
    const photos = await client.query('SELECT * FROM photos');
    res.json(photos.rows);
})

router.post('/', upload.single('imageFile'), async (req, res) => {
    const file = req.file;
    //create object key using format <userId>/<random key>
    //put object in s3 bucket
    //if error, send 500
    //create db entry for photo with object key
    //if error, send 500 and delete object from s3

    const objectKey = uuid();
    try {
        await uploadFile(file, objectKey);
        await client.query(`INSERT INTO photos (key) VALUES ('${objectKey}')`);
    } catch(err) {
        console.log(err)
        res.sendStatus(500);
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
    } catch(err) {
        res.sendStatus(500);
    }
})

module.exports = router;