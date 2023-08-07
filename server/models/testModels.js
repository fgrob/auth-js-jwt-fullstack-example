//borrar despues de testear

const db = require('./index');
const User = db.user;
const Role = db.role;

const initial = () => {
    Role.create({
        name: 'user'
    });

    Role.create({
        name: 'moderator'
    });

    Role.create({
        name:'admin'
    });
}

module.exports = initial;