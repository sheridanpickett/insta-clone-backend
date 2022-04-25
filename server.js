const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const upload = multer({dest: 'uploads/'});
app.use(cors());

const port = 4000;

app.get('/', (req, res) => {
    res.json({ user: 'sheridan'});
})

app.post('/images', upload.single('imageFile'), (req, res) => {
    const formData = req.file;
    console.log(formData);
    res.sendStatus(200);
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})