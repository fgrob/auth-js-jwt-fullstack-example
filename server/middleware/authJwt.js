const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const { TokenExpiredError } = jwt;

const verifyToken = (req, res, next) => { 
    let token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({ message: 'No token provided'}) // 403: Forbidden
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            if (err instanceof TokenExpiredError) { // if the captured error belongs to the TokenExpiredError object in jwt
                return res.status(401).send({ message: 'Access token expired'}) // 401: Unauthorized
            }

            return res.sendStatus(401) 
        }

        req.userId = decoded.id; // assing the decoded ID to the response to use in the following middlewares
        next();
    });
};

const isAdmin = (req, res) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'admin') {
                    res.sendStatus(200) // 200: OK
                    return;
                }
            }

            res.status(403).send({ message: 'You do not have the necessary permissions to access this resource'}); // 403: Forbidden
            return;
        });
    });
};

const isModerator = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'moderator') {
                    res.sendStatus(200) // 200: OK
                    return;
                }
            }

            res.status(403).send({ message: 'You do not have the necessary permissions to access this resource'}); // 403: Forbidden
            return;
        });
    });
};

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator,
};

module.exports = authJwt;