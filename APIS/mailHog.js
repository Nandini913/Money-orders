const {client} = require("../databaseConn");
const express = require('express')
const router = express.Router();
router.use (express.static ("./layouts"))
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/' ,async (req,res) => {
    const username = req.user.username;
    const userEmail = await client.query('Select email from users where username = $1',[username]);
    const toEmail = userEmail.rows[0].email;
    const emailData = await client.query('Select emailrecepient , numberoftransactions ,status from processes where emailrecepient=$1',[toEmail]);
    res.send(emailData.rows);
});

router.post('/',async(req,res)=>{
    const { limit } = req.query;
    const username = req.user.username;

    const users = await client.query(`SELECT user_id , email from users WHERE username = $1`,[username])
    const toEmail = users.rows[0].email;
    const status = "Pending"
    await client.query(`INSERT INTO processes (emailrecepient,numberoftransactions,status,type) values ($1,$2,$3,$4)` , [toEmail,limit,status,'Email'])
    res.send("Inserted")
});



module.exports = router;