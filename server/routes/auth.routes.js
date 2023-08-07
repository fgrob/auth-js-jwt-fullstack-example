const { verifySignup } = require('../middleware');
const authController = require('../controllers/auth.controller');

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

    app.post('/api/auth/signup', [verifySignup.checkDuplicateUsernameOrEmail], authController.signup);
    app.post('/api/auth/signin', authController.signin);
    app.post('/api/auth/signout', authController.signout);
    app.post('/api/auth/refreshtoken', authController.accessTokenWithRefreshToken);
}