const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser');
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const {
    Episode_data_map,
    Auto_refresh_episode_video_data_12_hours
} = require('./data/cache.js')
const { Episodes_data } = require('./database/EpisodeDataBase.js')

router.get('/', (req, res) => {
    res.status(200).send('This site is a part of ShowAnime Microservice-Based Database Architecture System')
})

router.post('/episode-data', async (req, res) => {
    try {

        const { saId } = req.body;
        const from = parseInt(req.body.from)
        const to = parseInt(req.body.to) 

        if (!Number.isInteger(from) || !Number.isInteger(to) || parseInt(from) <= 0 || parseInt(to) <= 0) {
            return res.status(200).json({
                found: false,
                response: 'Please provide an valid episode range',
                from: from,
                to: to
            });
        }

        const episodeNumbers = []
        const resultArr = []
        let initialLenth = 0
        
        for (let i = parseInt(from); i <= parseInt(to); i++) {
            episodeNumbers.push(i)
            initialLenth++
        }

        if (from === to) {
            episodeNumbers.push(to)
        }
        
        let i = 0;
        while (i < episodeNumbers.length) {
            if (Episode_data_map.has(episodeNumbers[i])) {
                resultArr.push(Episode_data_map.get(episodeNumbers[i]));
                episodeNumbers.splice(i, 1);
            } else {
                i++; // Increment i only if the element was not removed
            }
        }

        
        if (initialLenth === resultArr.length) {
            return res.status(200).json({
                found: true,
                data: resultArr,
            })
        }

        // Find the anime with the specified saId
        let anime = (await Episodes_data.findOne({ saId: parseInt(saId) }))
        
        if (anime === null) {
            return res.status(200).json({
                found: false,
                data: [
                    {
                        "number": from,
                        "thumbnail": null,
                        "english_title": null,
                        "japenese_title": null,
                        "romaji_title": null,
                        "released": null,
                        "duration": null
                    }
                ],
                message: 'Anime not found'
            });
        }
        
        anime = anime.toObject()

        // Filter episodes within the specified range
        const responseData = anime.episodes
            .filter(e => {
                return episodeNumbers.includes(parseInt(e.number))
            });

        for (let i = 0; i < responseData.length; i++) {
            episodeNumbers.push(responseData[i])
        }

        res.status(200).json({
            found: true,
            data: responseData
        });
    } catch (err) {
        console.log(err)
    }
});

router.post('/episode-data-all', async (req, res) => {
    try {

        const { saId } = req.body;

        let anime = await Episodes_data.findOne({ saId: parseInt(saId) })
        if (!anime) {
            return res.status(200).json({
                found: false,
                message: 'Anime not found'
            });
        }

        anime = anime.toObject()

        const responseData = anime.episodes
        res.status(200).json({
            found: true,
            data: responseData
        });
    } catch (err) {
        console.log(err)
    }
});

module.exports = router
