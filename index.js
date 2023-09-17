require('dotenv').config();
const {transactionProcessing} = require('./APIS/fetchTransaction'); // Assuming both files are in the same directory
const {emailProcessing } = require('./APIS/emailService')
const cookieParser = require ("cookie-parser");
function userTransaction() {
    const express = require('express');
    const app = express();
    const port = 3000;
    const cookieParser = require('cookie-parser');
    const users = require('./APIS/fetchUsers');
    const transactionHistory = require('./APIS/transactionHistory');
    const authenticate = require('./APIS/userValidation')
    const transaction = require('./APIS/transactionAPIS')
    const authMiddleware = require('./middleware/authMiddleware');
    const mailhog = require('./APIS/mailHog.js')
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.static('layouts'));
    app.use('/auth', authenticate)
    app.use(authMiddleware);
    app.use('/users', users);
    app.use('/transactionHistory', transactionHistory);
    app.use('/transaction', transaction);
    app.use('/send-mail', mailhog);

    app.listen(port, (req, res) => {
        console.log("Server was running on port 3000");
    });
}

if (process.env.APP_NAME === 'userTransaction') {
    userTransaction();
} else {
    setInterval(transactionProcessing, 10000);
    setInterval(emailProcessing,10000);
}