const config = require('../config/auth.config');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
    const RefreshToken = sequelize.define('refreshToken', {
        token: {
            type: Sequelize.STRING
        },
        expiryDate: {
            type: Sequelize.DATE
        },
    });

    RefreshToken.createToken = async function (user) { // static model
        let expiredAt = new Date();

        expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration); // actual time in seconds + expiration seconds

        let _token = uuidv4();

        let refreshToken = await this.create({
            token: _token,
            userId: user.id,
            expiryDate: expiredAt.getTime(),
        });

        return refreshToken.token;
    };

    RefreshToken.verifyExpiration = (token) => {
        return token.expiryDate.getTime() < new Date().getTime();
    };

    return RefreshToken;
};