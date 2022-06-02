const express = require('express');
const router = express.Router();
const { client } = require('../postgres');

router.post('/add', async (req, res) => {
    try {
        const { uid, postId, content, parentId } = req.body;
        if(!parentId) {
            await client.query(
                `INSERT INTO comments (post_id, user_uid, content)
                 VALUES ('${postId}', '${uid}', '${content}')`
            );
        } else {
            await client.query(
                `INSERT INTO comments (post_id, user_uid, content, ancestors)
                SELECT '${postId}', '${uid}', '${content}', array_append(ancestors, ${parentId})
                FROM comments
                WHERE id = ${parentId}`
            );
        }
        res.sendStatus(200);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
})

router.get('/get_all/:postId', async (req, res) => {
    try {
        const comments = (await client.query(`
            SELECT uid, username, post_id, content, ancestors, comments.date_created
            FROM comments INNER JOIN users ON comments.user_uid = users.uid 
            WHERE post_id = ${req.params.postId}
        `)).rows;
        res.send(comments);
    } catch(error) {
        console.log(error)
    }
})

router.get('/get_count/:postId', async (req, res) => {
    try {
        const comments = (await client.query(`
            SELECT COUNT(*)
            FROM comments
            WHERE post_id = ${req.params.postId}
        `)).rows;
        res.send(comments);
    } catch(error) {
        console.log(error)
    }
})


module.exports = router;