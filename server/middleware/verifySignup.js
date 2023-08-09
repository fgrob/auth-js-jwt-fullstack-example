const db = require('../models');
const User = db.user;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: 'Error. The user is already in use'
            });
            return;
        }

        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(user => {
            if (user) {
                res.status(400).send({
                    message: 'Error. The mail is already in use'
                });
                return;
            }

            next();
        });
    });
};

const verifySignup = {
    checkDuplicateUsernameOrEmail,
};

module.exports = verifySignup;