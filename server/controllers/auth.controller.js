const db = require('../models');
const config = require('../config/auth.config');
const { user: User, role: Role, refreshToken: RefreshToken } = db;

const Op = db.Sequelize.Op; // op es un objeto de sequelize para utilizar operadores y condiciones en consultas

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { request } = require('express');

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
                .then(() => { // Se añade el rol de 'user' (1) por defecto
                    // res.send({ message: 'Usuario registrado con éxito'})
                    res.status(200).send({ message: 'Usuario registrado exitosamente'})
                })
                .catch((err) => {
                    res.send({ message: 'Usuario registrado pero ocurrió un error al intentar asignarle el rol por defecto'})
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
            return res.status(404).send({ message: 'El usuario no existe' });
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({ message: 'Usuario y/o contraseña inválido'})
        }

        const token = await createAccessToken(user)

        const refreshToken = await RefreshToken.createToken(user);

        res.status(200).send({
            accessToken: token,
            refreshToken: refreshToken
        });
    } catch (err) {
        res.status(500).send({ message: err.message }) // 500: error genérico que indica problema interno del servidor
    }
}

const signout = (req, res) => {
    RefreshToken.destroy({
        where: {
            token: req.body.refreshToken
        }
    })
        .then(() => {
            res.status(200).json({ message: 'Token de actualización eliminado de la BBDD correctamente'});
        })
        .catch((err) => {
            res.status(500).json({ message: 'Error al intentar eliminar el Token de actualización'})
        })
};

const accessTokenWithRefreshToken = async (req, res) => { // generador de token de acceso con token de actualización
    const { refreshToken : requestToken } = req.body;

    if (requestToken === null) {
        return res.status(403).json({ message: 'Se requiere un token de actualización' }) // 403: Forbidden
    }

    try {
        let refreshToken = await RefreshToken.findOne({
            where: {
                token: requestToken
            }
        });

        if (!refreshToken) {
            res.status(403).json({ message: 'Token de actualización inválido' });
            return;
        }

        if (RefreshToken.verifyExpiration(refreshToken)) { // si el token está expirado, lo borramos de la BBDD
            RefreshToken.destroy({
                where: {
                    id: refreshToken.id
                }
            });

            res.status(403).json({ message: 'Token de actualización expirado. Favor logearse nuevamente' });
            return;
        }

        // Si el token de actualización existe y no está expirado, entonces: 
        const user = await refreshToken.getUser();
        const newAccessToken = await createAccessToken(user);

        // Actualizamos también el Token de Actualización (eliminando el antiguo y creando uno nuevo)
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
        return res.status(500).send({ message: 'Hubo un error en el servidor al intentar generar un nuevo Token de acceso'})
    }
};

const authController = {
    signup,
    signin,
    signout,
    accessTokenWithRefreshToken
}

module.exports = authController;

