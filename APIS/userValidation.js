const express = require ('express');
const bcrypt = require ('bcrypt');
const router = express.Router ();
const {client} = require ("../databaseConn");
const path = require ('path');
router.use (express.urlencoded ({extended : true}));
router.use (express.static ("./layouts"))
const jwt = require ('jsonwebtoken');
const secretKey = 'userController'
const cookieParser = require ('cookie-parser');
router.use (cookieParser ());


// Registration route handler
const register = async (req, res) => {
    const {username, password, email} = req.body;
    const hash_pass = await bcrypt.hash (password, 10);
    const result = await client.query ("Select max(user_id) from users");
    const user_id = ((parseInt (result.rows[0].max)) ? parseInt (result.rows[0].max) : 0) + 1;
    const query = {
        text : 'Insert into users (user_id, username, hash_pass , email) values ($1,$2,$3,$4)',
        values : [user_id, username, hash_pass, email]
    }
    await client.query (query);
    res.redirect ('/login.html')
};

router.post ('/register', register);

// Login route handler
const login = async (req, res) => {

    const {username, password} = req.body;
    const query = 'Select hash_pass from users where username = $1'
    try {
        const result = await client.query (query, [username]);

        // Check if a user with the given username was found
        if (result.rows.length === 0) {
            return res.status (401).send ('Username not found');
        }

        const hashedPassword = result.rows[0]['hash_pass']
        const passwordMatch = await bcrypt.compare (password, hashedPassword);

        if (passwordMatch) {
            const token = jwt.sign ({email : query.email, username : query.username}, secretKey)
            res.cookie ('jwtAccessToken', token, {httpOnly : true, secure : true, sameSite : 'strict'})
            res.redirect ('./transactionPage.html')
        } else {
            // Passwords do not match
            res.status (401).send ('Authentication failed');
        }
    } catch (error) {
        console.error ('Error in login:', error);
    }
}
router.post ('/login', login);

module.exports = router;
