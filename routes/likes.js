const express = require('express');
const router = express.Router();
const { client } = require('../postgres');

router.post('/toggle_like', async (req, res) => {
    const { postId, uid } = req.body;
    try {
        const likes = await client.query(`
            SELECT COUNT(*) FROM users_likes_posts
            WHERE post_id = ${postId}
        `)
        console.log(likes)
        if(likes.rows[0].count > 0) {
            await client.query(`DELETE FROM users_likes_posts WHERE user_uid = '${uid}' AND post_id = ${postId}`);
        } else {
            await client.query(`INSERT INTO users_likes_posts (user_uid, post_id) VALUES ('${uid}', '${postId}')`);
        }
        return res.sendStatus(200);
    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

router.get('/like_count/:postId', async (req, res) => {
    try {
        const count = await client.query(`
            SELECT COUNT(*) FROM users_likes_posts 
            WHERE post_id = '${req.params.postId}'`);
        return res.send(count);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
})

module.exports = router;