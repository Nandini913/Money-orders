const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const {client} = require("../databaseConn");
const path = require('path');

router.use(express.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname , '../layouts')));
router.get('/', (req, res) => {
        res.sendFile(path.join(__dirname , '../layouts/register.html'));
});
router.post('/', async (req, res) => {

        const { username, password ,email} = req.body;
        const hash_pass = await bcrypt.hash(password, 10);
        const result = await client.query("Select max(user_id) from users");
        const user_id = ((parseInt(result.rows[0].max))?parseInt(result.rows[0].max):0) + 1;;
        const query={
                text : 'Insert into users (user_id, username, hash_pass , email) values ($1,$2,$3,$4)',
                values : [user_id,username,hash_pass,email]
        }
        await client.query(query);
        res.sendFile(path.join(__dirname,'../layouts/login.html'))
});

module.exports = router;
