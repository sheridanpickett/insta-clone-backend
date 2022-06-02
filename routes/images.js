const express = require('express');
const router = express.Router();
const { uploadFile, getFile, deleteFile } =  require('../s3');

router.get('/:key', async (req, res) => {
    try {
        const file = await getFile(req.params.key);
        file.Body.pipe(res);
    } catch(error) {
        console.log(error)
        return res.sendStatus(500);
    }
})

module.exports = router;