const express = require('express');
const router = express.Router();
const {client} = require("../databaseConn");
router.use(express.urlencoded({ extended: true }));


router.get('/',async(req,res)=>{
    try {
        const { rows } = await client.query('select username from users where designation <> \'admin\'');
        const usernames = rows.map(row => row.username);
        res.send(usernames);
    } catch (error){
        console.error('Error fetching usernames:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/current',(req,res) => {
    console.log(req.user);
    res.json(req.user);
})

module.exports = router;
