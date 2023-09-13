const express = require('express');
const router = express.Router();
const {client} = require("../databaseConn");
router.use(express.urlencoded({ extended: true }));

router.get('/',async(req,res)=>{
    try {
        const {username,designation} = req.user;
        let rows ;
        if(designation === "customer"){
            const query = 'SELECT * FROM transaction where fromuser = ($1) OR touser = ($2)'
             rows  = (await client.query(query,[username,username])).rows;
        }else{
            const query = 'SELECT * FROM transaction'; // Replace with your table name
            rows  = (await client.query(query)).rows;
        }
        res.json(rows);
    } catch (error) {
        console.error('Error fetching table data from PostgreSQL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
