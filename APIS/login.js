const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const secretKey = 'userController'
const {client} = require("../databaseConn");
const path = require('path');
const cookieParser = require('cookie-parser');
router.use(cookieParser());
router.use(express.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname , '../layouts')));
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname , '../layouts/login.html'));
});
router.post('/', async (req, res)=> {

    const {username , password} = req.body;
    const query = 'Select hash_pass from users where username = $1'
    try {
        const result = await client.query (query, [username]);

        // Check if a user with the given username was found
        if (result.rows.length === 0) {
            return res.status (401).send ('Username not found');
        }

        const hashedPassword = result.rows[0]['hash_pass']

        // Compare the hashed password with the submitted password
        const passwordMatch = await bcrypt.compare (password, hashedPassword);

        if (passwordMatch) {
            // Passwords match; user is authenticated
            console.log("password matched")
            const token = jwt.sign ({email : query.email, username : query.username}, secretKey)
            res.cookie('jwtAccessToken', token, { httpOnly: true, secure: true, sameSite: 'strict' })
            res.sendFile(path.join(__dirname,'../layouts/transactionPage.html'))

        } else {
            // Passwords do not match
            res.status (401).send ('Authentication failed');
        }
    } catch (error) {
        console.error ('Error in login:', error);
    }

    });

module.exports = router;
