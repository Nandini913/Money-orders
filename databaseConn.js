const {Client} = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'money-orders',
    password: 'postgres',
    port: 5432, // Default PostgreSQL port
});

client.connect((err) => {
    if (err) console.log("Error occurred : " + err.message);
    else console.log("Connected");
});

module.exports = {client};