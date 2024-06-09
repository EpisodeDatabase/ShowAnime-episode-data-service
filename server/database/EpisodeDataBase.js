const mongoose = require('mongoose');
const { Schema } = mongoose;

const uri = "mongodb+srv://supershow420:MkeVcXZmpQTRKub4@showanimeepisodedata.nuzymsl.mongodb.net/Episodes?retryWrites=true&w=majority";

const EpisodesDataBaseConnection = mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

EpisodesDataBaseConnection.on('connected', () => {
    console.log('Successfully connected to the EpisodesDataBase database');
});

EpisodesDataBaseConnection.on('error', (err) => {
    console.error('Error connecting to the EpisodesDataBase database', err);
});

// Models 

const Episodes_data_schema = new Schema({
    number: { type: Number, required: true },
    thumbnail: { type: String, default: null },
    english_title: { type: String, required: true, default: null },
    japanese_title: { type: String, required: true, default: null },
    romaji_title: { type: String, required: true, default: null },
    released: { type: Date, required: true },
    duration: { type: String, required: true, default: null }
});

const Episodes = new Schema({
    saId: { type: String, required: true },
    malId: { type: String, required: true },
    episodes: { type: [Episodes_data_schema], required: true }
}, { collection: 'episodes_data' })

const Episodes_data = EpisodesDataBaseConnection.model('episodes_data', Episodes);

module.exports = {
    EpisodesDataBaseConnection,
    Episodes_data
};
