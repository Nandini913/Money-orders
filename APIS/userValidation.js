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
        if (username === 'admin') {
            const adminData = 'Select * from users where designation = $1'
            const admin = await client.query(adminData, [username])
            const designation = admin.rows[0].designation;
            const email = admin.rows[0].email;
            const adminPass = admin.rows[0]['hash_pass'];
            if (password === adminPass) {
                console.log("Matched admin")
                const token = jwt.sign({"username": adminData.username, "designation": designation,"email":email}, secretKey)
                res.cookie('jwtAccessToken', token, {httpOnly: true})
                res.redirect('./Dashboard.html')
            }
        } else {
            const userData = 'Select * from users where username = $1'
            const user = await client.query(userData, [username]);
            const email = user.rows[0].email;
            console.log(email);
            const designation = user.rows[0].designation;
            // Check if a user with the given username was found
            if (user.rows.length === 0) {
                return res.status(401).send('Username not found');
            }

            const hashedPassword = user.rows[0]['hash_pass']
            const passwordMatch = await bcrypt.compare(password, hashedPassword);

            if (passwordMatch) {
                const token = jwt.sign({"username": user.rows[0].username, "designation": designation,"email":email}, secretKey)
                res.cookie('jwtAccessToken', token, {httpOnly: true})
                res.redirect('./Dashboard.html')
            } else {
                res.redirect('./login.html')
            }
        }
    } catch (error) {
        console.error('Error in login:', error);
    }
}
router.post('/login', login);

module.exports = router;
