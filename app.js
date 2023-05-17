const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
require('./db');
const port = process.env.PORT || 4000;

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

const corsOptions = {
    origin: ['http://localhost:4000', 'http://localhost:3000', 'http://localhost:5000', 'http://localhost:6000']
}

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static('public'))

app.use('/api/files', require('./routes/fileRoute'));
app.use('/files', require('./routes/showRoute'));
app.use('/files/download', require('./routes/downloadRoute'));

app.listen(port, () => {
    console.log(`Application Listening on port ${port}`);
})
