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
                message: 'Error. El usuario ya está en uso'
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
                    message: 'Error. El correo ya está en uso'
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