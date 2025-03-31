const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');


const client = new MongoClient(process.env.MONGODB_URI);

let _db;

const initDb = async () => {
    if (_db) {
        console.log("Database is already initialized!");
        return _db;
    }
    try {
        await client.connect();
        _db = client.db("project2"); 
        console.log("Connected to MongoDB");
        return _db;
    } catch (err) {
        console.error("Database connection error:", err.message);
        throw err;
    }
  };


const getDb = () => {
  if (!_db) {
    throw Error('Db not initialized');
  }
  return _db;
};


module.exports = {
  initDb,
  getDb
};

