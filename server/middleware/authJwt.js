const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const { TokenExpiredError } = jwt;

const verifyToken = (req, res, next) => { // para verificar si el token de acceso está vigente
    let token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({ message: 'No se proporcionó Token'}) // 403: Forbidden
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            if (err instanceof TokenExpiredError) { // si el error capturado pertenece al objeto TokenExpiredError de jwt
                return res.status(401).send({ message: 'Token de acceso expirado'}) // 401: Unauthorized
            }

            return res.sendStatus(401) // sendStatus lo usamos para enviar solamente el status (cuerpo vacío). Aplica en este caso pues hubo un error desconocido asociado al cliente (4xx)
        }

        req.userId = decoded.id; // asignamos el id decodificado a la respuesta para usarlo en los siguientes middlewares
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

            res.status(403).send({ message: 'No tiene los permisos necesarios para acceder a este recurso'}); // 403: Forbidden
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

            res.status(403).send({ message: 'No tiene los permisos necesarios para acceder a este recurso'}); // 403: Forbidden
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