const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173'
}));

const db = require('./models');
const initial = require('./models/testModels'); // borrar despues de testear
// db.sequelize.sync({force: true}).then(() => {
db.sequelize.sync().then(() => { // version sin force para que no me borre la bbdd
    console.log('Borrando y resincronizando la DB') // actualizar mensaje
    // initial(); // borrar despues de testear 
})

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// app.get('/', (req, res) => {
//     res.json({ message: 'bueeenabuena'})
// })

app.listen(8080, () => {
    console.log('Servidor corriendo en el puerto 8080')
});

