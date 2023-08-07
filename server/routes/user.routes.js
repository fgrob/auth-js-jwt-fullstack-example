const { authJwt } = require("../middleware");


module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-type, Accept'
        );
        next();
    });

    app.get('/api/check/moderator',
        [authJwt.verifyToken, authJwt.isModerator]
    );

    app.get('/api/check/admin',
        [authJwt.verifyToken, authJwt.isAdmin], 
    );
}