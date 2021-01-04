const mysql = require('promise-mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'aprova935_db'
})

function conex() {
    return connection;
}

module.exports = {conex}