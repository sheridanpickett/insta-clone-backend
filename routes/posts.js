const express = require('express');
const multer = require('multer');
const { v4: uuid } = require('uuid');
const { client } = require('../postgres');
const { uploadFile, getFile, deleteFile } =  require('../s3');

const router = express.Router();
const upload = multer();


router.post('/create_post', upload.single('imageFile'), async (req, res) => {
    try{
        const file = req.file;
        const uid = req.body.uid
        const fileKey = uuid();
        await uploadFile(file, fileKey);
        await client.query(`INSERT INTO posts (user_uid, file_key) VALUES ('${uid}', '${fileKey}')`);
        res.sendStatus(200);
    } catch(error) {
        console.log(error)
        res.sendStatus(500);
    }
})

router.get('/all_posts', async (req, res) => {
    try {
        let posts = await client.query(`
            SELECT posts.date_created AS date_created, id, file_key, uid, full_name, username
            FROM posts JOIN users ON uid = user_uid
        `);
        console.log(posts);
        return res.send(posts.rows);
    } catch(err) {
        console.log(err);
    }
})

router.get('/:key', async (req, res) => {
    try {
        const file = await getFile(req.params.key);
        file.Body.pipe(res);
    } catch(err) {
        return res.sendStatus(500);
    }
})

router.delete('/:key', async (req, res) => {
    try {
        await deleteFile(req.params.key);
        return res.sendStatus(200);
    } catch(err) {
        return res.sendStatus(500);
    }
})

module.exports = router;