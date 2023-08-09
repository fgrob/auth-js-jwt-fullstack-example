const db = require('../models');
const config = require('../config/auth.config');
const { user: User, refreshToken: RefreshToken } = db;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createAccessToken = async (user) => {

    const roles = await user.getRoles();
    const authorities = roles.map(role => role.name);

    const token = jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities
        },
        config.secret,
        {
            expiresIn: config.jwtExpiration
        }
    );
    return token;
};

const signup = (req, res) => {
    
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    })
        .then(user => {
            user.setRoles([1])
                .then(() => { // The 'user' role (1) is added by default
                    res.status(200).send({ message: 'User successfully registered'})
                })
                .catch(() => {
                    res.send({ message: 'User successfully registered but an error ocurred while trying to assign the defualt role'})
                })
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

const signin = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username
            }
        });

        if (!user) {
            return res.status(404).send({ message: 'The user does not exist' });
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({ message: 'Invalid username and/or password'})
        }

        const token = await createAccessToken(user)

        const refreshToken = await RefreshToken.createToken(user);

        res.status(200).send({
            accessToken: token,
            refreshToken: refreshToken
        });
    } catch (err) {
        res.status(500).send({ message: err.message }) // 500: generic error indicating an internal server problem
    }
}

const signout = (req, res) => {
    RefreshToken.destroy({
        where: {
            token: req.body.refreshToken
        }
    })
        .then(() => {
            res.status(200).json({ message: 'Refresh token successfully deleted from the database'});
        })
        .catch(() => {
            res.status(500).json({ message: 'Error while trying to delete the refresh token'})
        })
};

const accessTokenWithRefreshToken = async (req, res) => { // Access token generator with refresh token
    const { refreshToken : requestToken } = req.body;

    if (requestToken === null) {
        return res.status(403).json({ message: 'A refresh token is required' }) // 403: Forbidden
    }

    try {
        let refreshToken = await RefreshToken.findOne({
            where: {
                token: requestToken
            }
        });

        if (!refreshToken) {
            res.status(403).json({ message: 'Invalid refresh token' });
            return;
        }

        if (RefreshToken.verifyExpiration(refreshToken)) { // If the token is expired, we delete it from the database
            RefreshToken.destroy({
                where: {
                    id: refreshToken.id
                }
            });

            res.status(403).json({ message: 'Refresh token expired. Please log in again' });
            return;
        }

        // If the refresh token exists and is not expired, then:
        const user = await refreshToken.getUser();
        const newAccessToken = await createAccessToken(user);

        // We also update the refresh token (by deleting the old one and creating a new one)
        await RefreshToken.destroy({
            where: {
                id: refreshToken.id
            }
        });

        const newRefreshToken = await RefreshToken.createToken(user); 

        res.status(200).send({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });
        
    } catch (err) {
        return res.status(500).send({ message: 'There was a server error while trying to generate a new access token'})
    }
};

const authController = {
    signup,
    signin,
    signout,
    accessTokenWithRefreshToken
}

module.exports = authController;

