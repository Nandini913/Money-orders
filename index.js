const express = require ('express');
const app = express ();
const port = 3000;
app.use (express.json ());
app.use (express.static ('layouts'));
const deposit = require ('./APIS/deposit');
const withdraw = require ('./APIS/withdraw');
const transfer = require ('./APIS/transfer');
const users = require ('./APIS/fetchUsers');
const transactionHistory = require ('./APIS/transactionHistory');
const authenticate = require ('./APIS/userValidation')
app.use ('/auth', authenticate)
app.use ('/deposit', deposit);
app.use ('/withdraw', withdraw);
app.use ('/transfer', transfer);
app.use ('/users', users);
app.use ('/transactionHistory', transactionHistory);

app.listen (port, (req, res) => {
    console.log ("Server was running on port 3000");
});

