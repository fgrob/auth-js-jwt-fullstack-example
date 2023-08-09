//Required for the initial creation of roles. You can also add other test models to start with information in the database, such as a user with different authorities.

const db = require('./index');
const Role = db.role;
// const User = db.user 

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