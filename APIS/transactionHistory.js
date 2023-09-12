const express = require('express');
const router = express.Router();
const {client} = require("../databaseConn");
router.use(express.urlencoded({ extended: true }));


router.get('/',async(req,res)=>{
    try {
        const query = 'SELECT * FROM transaction'; // Replace with your table name
        const { rows } = await client.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching table data from PostgreSQL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
