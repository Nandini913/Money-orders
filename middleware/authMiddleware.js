const jwt = require('jsonwebtoken');
const secretKey = 'userController'

function authMiddleware(req, res, next) {

    const jwtAccessToken = req.cookies["jwtAccessToken"];

    if (!jwtAccessToken) {
        res.redirect('/login.html');
        return;
    }

    jwt.verify(jwtAccessToken, secretKey, (err, user) => {
        if (err) {
            res.redirect('/login.html');
            return;
        }

        req.user = {
            username: user.username,
            designation: user.designation,
        }
        next();
    })
}

module.exports = authMiddleware;