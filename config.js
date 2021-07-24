require('dotenv').config();

const { JWT_SECRET = 'secret-key', MONGO_URL = 'mongodb://localhost:27017/movies-explorer-db' } = process.env;

module.exports = { MONGO_URL, JWT_SECRET };
