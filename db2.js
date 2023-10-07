const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USUARIO,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});


db.execute('SELECT 1 + 1 as result')
  .then(() => {
    console.log('Connected to database!');
  })
  .catch((err) => {
    console.error('Error connecting to database:', err);
  });

module.exports = db;