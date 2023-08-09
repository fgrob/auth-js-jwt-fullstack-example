const config = require('../config/db.config'); // Importamos los datos de configuración de la conexión

const Sequelize = require('sequelize'); // Sequelize library
const sequelize = new Sequelize(        // Sequelize instance with config data
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
    }
);

const db = {}; // Object to store all model definitions

db.Sequelize = Sequelize; // Sequelize class reference in the created object
db.sequelize = sequelize; // Sequelize instance reference in the created object

// Require and at the same time execute to create them in the database and save them in the created object por later use
db.user = require('../models/user.model')(sequelize, Sequelize); 
db.role = require('../models/role.model')(sequelize, Sequelize); 
db.refreshToken = require('../models/refreshToken.model')(sequelize, Sequelize);

// Establish the relationships between the models
db.role.belongsToMany(db.user, {
    through: 'user_roles',
    foreignKey: 'roleId',
    otherKey: 'userId',
});
db.user.belongsToMany(db.role, {
    through: 'user_roles',
    foreignKey: 'userId',
    otherKey: 'roleId'
});
db.refreshToken.belongsTo(db.user, {
    foreignKey: 'userId', targetKey: 'id'
});
db.user.hasOne(db.refreshToken, {
    foreignKey: 'userId', targetKey: 'id'
});

module.exports = db;



