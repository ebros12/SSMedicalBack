const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USUARIO,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to database!');
});

module.exports = connection;