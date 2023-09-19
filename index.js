require('dotenv').config();
const {transactionProcessing} = require('./APIS/transaction_processing'); // Assuming both files are in the same directory
const {emailProcessing } = require('./APIS/email_service')
const cookieParser = require ("cookie-parser");
function userTransaction() {
    const express = require('express');
    const app = express();
    const port = 3000;
    const cookieParser = require('cookie-parser');
    const users = require('./APIS/fetch_users');
    const transactionHistory = require('./APIS/transaction_data');
    const authenticate = require('./APIS/user_validation')
    const transaction = require('./APIS/transaction_service')
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