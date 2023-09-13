const express = require('express');
const router = express.Router();
const {client} = require("../databaseConn");
const {verify} = require ("jsonwebtoken");
router.use (express.static ("./layouts"))
router.use(express.urlencoded({ extended: true }));
const secretKey = 'userController'

router.use((req,res,next)=>{
    const token = req.cookies['jwtAccessToken'];
    if(!token) {
        return res.status(400).send("Token not found");
    }
    verify(token,secretKey, (err, payload) => {
        console.log(payload.username)
        console.log(payload.password)
        if ( payload.designation !== 'admin') {
            return res.status(401).json("You are not admin");
        }
        req.user = {
            username: payload.username,
            designation: payload.designation
        }
        next();
    });
});
router.post('/',async(req,res)=>{
    const {fromUser , amount} = req.body;
    const query = {
        text : 'Insert into transaction (type, fromuser, touser, amount) values ($1,$2,$3,$4,$5)',
        values : ['Withdraw',fromUser,'-',amount]
    }
    await client.query(query);
    res.redirect('./transactionPage.html')
});
module.exports = router;
