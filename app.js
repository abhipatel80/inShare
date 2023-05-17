const express = require('express');
const app = express();
const path = require('path');
require('./db');
const port = process.env.PORT || 4000;

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static('public'))

app.use('/api/files', require('./routes/fileRoute'));
app.use('/files', require('./routes/showRoute'));
app.use('/files/download', require('./routes/downloadRoute'));

app.listen(port, () => {
    console.log(`Application Listening on port ${port}`);
})
