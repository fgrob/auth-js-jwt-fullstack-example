const config = require('../config/db.config'); // Importamos los datos de configuración de la conexión

const Sequelize = require('sequelize'); // Importamos la bliblioteca Sequelize
const sequelize = new Sequelize(        // Creamos una instancia de Sequelize con los datos de configuración
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
    }
);

const db = {}; // Creamos un objeto para almacenar todas las definiciones de modelos

db.Sequelize = Sequelize; // Guardamos la referencia a la clase Sequelize
db.sequelize = sequelize; // Guardamos la referencia a la instancia de Sequelize

// 'requerimos' y a la vez ejecutamos para que se creen en la base de datos y las guardamos en el objeto db para poder usarlas
db.user = require('../models/user.model')(sequelize, Sequelize); 
db.role = require('../models/role.model')(sequelize, Sequelize); 
db.refreshToken = require('../models/refreshToken.model')(sequelize, Sequelize);

// Establecemos las relaciones entre los modelos
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



