const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const {client} = require("../databaseConn");
const path = require('path');
router.use(express.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname , '../layouts')));
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname , '../layouts/transactionPage.html'));
});

router.post('/',async(req,res)=>{
    const {fromUser , amount} = req.body;
    const result = await client.query('select max(transactionId) from transaction');
    const maxId = ((parseInt(result.rows[0].max))?parseInt(result.rows[0].max):0)
    const transId = maxId + 1;

    const query = {
        text : 'Insert into transaction (transactionid, type, fromuser, touser, amount) values ($1,$2,$3,$4,$5)',
        value : [transId ,'Withdraw',fromUser,'-',amount]
    }

    await client.query(query);
    res.send(amount+"Withdrawn");
});
module.exports = router;
