const express = require('express');
const router = express.Router();
const {client} = require("../databaseConn");
const {verify} = require ("jsonwebtoken");
const secretKey = 'userController'
router.use (express.static ("./layouts"))
router.use(express.urlencoded({ extended: true }));

// router.use((req,res,next)=>{
//     const token = req.cookies['jwtAccessToken'];
//     if(!token) {
//         return res.status(400).send("Token not found");
//     }
//     verify(token,secretKey, (err, payload) => {
//         if (err || payload.designation !== 'admin') {
//             return res.status(401).json("You are not admin");
//         }
//         req.user = {
//             username: payload.username,
//             designation: payload.designation
//         }
//     });
// });

router.post('/',async(req,res)=>{
    const {transactionType,fromUser,toUser,amount} = req.body;
    const query = {
        text : 'Insert into transaction (type, fromuser, touser, amount) values ($1,$2,$3,$4)',
        values : [transactionType,fromUser,toUser,amount]
    }
    await client.query(query.text,query.values);
    console.log('Transaction successful');
});

module.exports = router;
