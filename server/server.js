const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const port = 3002;
const EpisodeDataBase = require('./database/EpisodeDataBase.js')
const api = require('./api.js');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../ShowAnime')));
app.use('/', api);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});