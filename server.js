require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const images = require('./routes/images');
app.use('/images', images);


app.listen(process.env.SERVER_PORT, () => {
    console.log(`listening on port ${process.env.SERVER_PORT}`);
})