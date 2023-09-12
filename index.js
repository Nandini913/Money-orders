const express = require('express');
const app = express();
const port = 3000;
const register= require('./APIS/register');
const login  = require('./APIS/login');
const deposit = require('./APIS/deposit');
const withdraw = require('./APIS/withdraw');
const transfer = require('./APIS/transfer');
const users = require('./APIS/fetchUsers');
const path = require ("path");
app.use(express.static('layouts'));
app.use(express.json());
app.use('/register' , register);
app.use('/login',login);
app.use('/deposit',deposit);
app.use('/withdraw',withdraw);
app.use('/transfer',transfer);
app.use('/users',users);

app.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname,'../Money-orders/layouts/register.html'))
})
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'../Money-orders/layouts/login.html'))
})

app.get('/deposit',(req,res)=>{
    res.sendFile(path.join(__dirname,'../Money-orders/layouts/transactionPage.html'))
    res.end();
})
app.listen(port , (req,res) => {
    console.log("Server was running on port 3000");
});

