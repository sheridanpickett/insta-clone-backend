require('dotenv').config({path: '.env.test'});
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

const posts = require('./routes/posts');
app.use('/posts', posts);
const accounts = require('./routes/accounts');
app.use('/accounts', accounts);
const comments = require('./routes/comments');
app.use('/comments', comments);
const images = require('./routes/images');
app.use('/images', images);
const likes = require('./routes/likes');
app.use('/likes', likes);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`listening on port ${process.env.SERVER_PORT}`);
})