const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const {client} = require("../databaseConn");
router.use(express.urlencoded({extended: true}));
router.use(express.static("./layouts"))
const jwt = require('jsonwebtoken');
const secretKey = 'userController'
const cookieParser = require('cookie-parser');
router.use(cookieParser());


// Registration route handler
const register = async (req, res) => {
    const {username, password, email} = req.body;
    const hash_pass = await bcrypt.hash(password, 10);
    const registerUser = {
        text: 'Insert into users (username, hash_pass , email) values ($1,$2,$3)',
        values: [username, hash_pass, email]
    }
    await client.query(registerUser);
    res.redirect('/login.html')
};

router.post('/register', register);

// Login route handler
const login = async (req, res) => {

    const {username, password} = req.body;
    try {
        const userData = 'Select * from users where username = $1'
        const user = await client.query(userData , [username]);
        if (user.rows.length === 0) {
            return res.status(401).send('Username not found');
        }
        const designation = user.rows[0].designation;
        const userPassword = user.rows[0]['hash_pass']
        const email = user.rows[0].email;
        let passwordMatch = false;
        if(designation === 'admin'){
            passwordMatch = (password === userPassword);
        }
        else {
            passwordMatch = await bcrypt.compare (password, userPassword);
        }
        if (passwordMatch) {
            const token = jwt.sign({"username": user.rows[0].username, "designation": designation,"email":email}, secretKey)
            res.cookie('jwtAccessToken', token, {httpOnly: true})
            res.redirect('./Dashboard.html')
        } else {
            alert("Incorrect Credentials");
            res.redirect('./login.html')
        }
    } catch (error) {
        console.error('Error in login:', error);
    }
}
router.post('/login', login);

module.exports = router;