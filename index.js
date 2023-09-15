require('dotenv').config();
const { fetchRows } = require('./APIS/fetchTransaction'); // Assuming both files are in the same directory

function transaction(){
    const express = require ('express');
    const app = express ();
    const port = 3000;
    app.use (express.json ());
    app.use (express.static ('layouts'));
    const cookieParser = require ('cookie-parser');
    app.use (cookieParser ());
    const users = require ('./APIS/fetchUsers');
    const transactionHistory = require ('./APIS/transactionHistory');
    const authenticate = require ('./APIS/userValidation')
    const transaction = require('./APIS/transactionAPIS')
    const authMiddleware = require('./middleware/authMiddleware');
    const mailhog = require('./APIS/mailHog.js')
    app.use ('/auth', authenticate)
    app.use(authMiddleware);
    app.use ('/users', users);
    app.use ('/transactionHistory', transactionHistory);
    app.use('/transaction',transaction);
    app.use('/send-mail',mailhog);
    app.listen (port, (req, res) => {
        console.log ("Server was running on port 3000");
    });
}

function poolOperation(){
    fetchRows();
}

if(process.env.APP_NAME === 'api'){
    transaction();
}else{
    poolOperation();
}