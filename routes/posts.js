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
        return res.sendStatus(500);
    }
})

router.post('/get_post', async (req, res) => {
    console.log(req.body)
    const { postId, viewerUid } = req.body;
    try {
        const post = await client.query(`
            SELECT posts.date_created AS date_created, posts.id as post_id, EXISTS(SELECT 1 FROM users_likes_posts WHERE users_likes_posts.user_uid = '${viewerUid}' AND users_likes_posts.post_id = ${postId}) as liked_by_viewer, file_key, uid, full_name, username
            FROM posts 
                INNER JOIN users ON uid = user_uid
            WHERE posts.id = ${postId}
        `)
        console.log(post)
        return res.send(post.rows[0]);
    } catch(error) {
        console.log(error)
    }
})

router.post('/all_posts', async (req, res) => {
    const { viewerUid } = req.body;
    try {
        const posts = await client.query(`
            SELECT posts.date_created AS date_created, posts.id as post_id, EXISTS(SELECT 1 FROM users_likes_posts WHERE users_likes_posts.user_uid = '${viewerUid}' AND users_likes_posts.post_id = post_id) as liked_by_viewer, file_key, uid, full_name, username
            FROM posts 
                INNER JOIN users ON uid = user_uid
        `);
        console.log(posts);
        return res.send(posts.rows);
    } catch(error) {
        console.log(error);
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