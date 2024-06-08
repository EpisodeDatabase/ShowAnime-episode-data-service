const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const fetch = require('node-fetch')
const port = 3002;
const EpisodeDataBase = require('./database/EpisodeDataBase.js')
const api = require('./api.js');

const allowedOrigins = ['http://localhost:3000', 'https://showanime.fun', 'http://showanime.fun'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../ShowAnime')));
app.use('/', api);

setInterval(async () => {
    const url = `https://showanime-episode-data-service.onrender.com`;
    const response = await fetch(url);
}, 240000);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
