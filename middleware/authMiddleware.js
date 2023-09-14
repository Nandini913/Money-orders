const jwt = require ('jsonwebtoken');
const secretKey = 'userController'

function authMiddleware(req,res,next) {
    const jwtAccessToken = req.cookies["jwtAccessToken"];

    if (!jwtAccessToken) {
        res.redirect('/login.html');
        return;
    }

    jwt.verify(jwtAccessToken, secretKey, (err, payload) => {
        if (err) {
            res.clearCookie("jwtAccessToken");
            res.redirect('/login.html');
            return;
        }
        console.log(payload);
        req.user = {
            username: payload.username,
            designation: payload.designation,
        }
        next();
    })
}

module.exports =  authMiddleware;