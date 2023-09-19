const express = require('express');
const router = express.Router();
const {client} = require("../databaseConn");
router.use(express.urlencoded({extended: true}));

router.get('/', async (req, res) => {
    try {
        const {username, designation} = req.user;
        let rows;
        if (designation === "customer") {
            const query = 'SELECT * FROM processes where transactiontouser = $1 OR transactionfromuser = $1 ORDER BY date DESC'
            rows = (await client.query(query, [username])).rows;
            return res.status(200).json({rows, designation});
        } else {
            const query = 'SELECT * FROM processes WHERE type IN ($1,$2,$3) ORDER BY date DESC'
            rows = (await client.query(query, ['Deposit', 'Withdraw', 'Transfer'])).rows;
            return res.status(200).json({rows, designation});
        }
    } catch (error) {
        console.error('Error fetching table data from PostgreSQL:', error);
        return res.status(500).json({error: 'Internal Server Error'});
    }
});


router.get('/email', async (req, res) => {
    try {
        const {designation, email} = req.user;
        let rows;
        if (designation === "customer") {
            const query = 'SELECT * FROM processes where emailrecepient = ($1) ORDER BY id'
            rows = (await client.query(query, [email])).rows;
            return res.status(200).json({rows, designation});
        } else {
            // await removeChild(customer-container);
            const query = 'SELECT * FROM processes'; // Replace with your table name
            rows = (await client.query(query)).rows;
            return res.status(200).json({rows, designation});
        }
    } catch (error) {
        console.error('Error fetching table data from PostgreSQL:', error);
        return res.status(500).json({error: 'Internal Server Error'});
    }
});

router.get('/newTransaction', async (req, res) => {
    try {
        const {username, designation} = req.user;
        let rows;
        if (designation === "customer") {
            const query = 'SELECT * FROM processes where transactiontouser = $1 OR transactionfromuser = $1 ORDER BY date'
            rows = (await client.query(query, [username])).rows;
            return res.status(200).json({rows, designation});
        } else {
            const query = 'SELECT * FROM processes WHERE type IN ($1,$2,$3) ORDER BY date'
            rows = (await client.query(query, ['Deposit', 'Withdraw', 'Transfer'])).rows;
            return res.status(200).json({rows, designation});
        }
    } catch (error) {
        console.error('Error fetching table data from PostgreSQL:', error);
        return res.status(500).json({error: 'Internal Server Error'});
    }
});

module.exports = router;
