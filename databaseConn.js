const { Client } = require('pg');

const client = new Client({
    user: 'nandini',
    host: 'localhost',
    database: 'money-orders',
    password: 'nandu@913',
    port: 5432, // Default PostgreSQL port
});

client.connect((err) => {
    if(err) console.log("Error occured : "+ err.message);
    else console.log("Connected");
});

module.exports = {client};