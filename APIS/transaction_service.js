const express = require('express');
const router = express.Router();
const {client} = require("../databaseConn");
router.use(express.static("./layouts"));
router.use(express.urlencoded({extended: true}));

router.post('/', async (req, res) => {
    const {transactionType, fromUser, toUser, amount} = req.body;
    const query = {
        text: 'Insert into transaction (type, fromuser, touser, amount) values ($1,$2,$3,$4)',
        values: [transactionType, fromUser, toUser, amount]
    }
    await client.query(query);

    const query1 = {
        text : 'insert into processes (type,transactionfromuser,transactiontouser,amount) values ($1,$2,$3,$4)',
        values : [transactionType,fromUser,toUser,amount],
    }
    await client.query(query1);
    console.log('Transaction successful');
});

module.exports = router;
