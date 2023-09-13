const express = require('express');
const router = express.Router();
const {client} = require("../databaseConn");
router.use(express.urlencoded({ extended: true }));
router.use (express.static ("./layouts"))
router.post('/',async(req,res)=>{
    const {user,amt,type} = req.body;
    const result = await client.query('select max(transactionId) from transaction');
    const maxId = ((parseInt(result.rows[0].max))?parseInt(result.rows[0].max):0)
    const transId = maxId + 1;
    const query = {
        text : 'Insert into transaction (transactionid, type, fromuser, touser, amount) values ($1,$2,$3,$4,$5)',
        values : [transId ,type,'-',user,amt]
    }
    await client.query(query);
    console.log('Deposit successful');
    return res.status(200).json({message : "Transaction Successfull"});
});
module.exports = router;
