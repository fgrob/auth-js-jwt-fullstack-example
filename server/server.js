const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173'
}));

const db = require('./models');
// const initial = require('./models/testModels'); // Use the first time to create some necessary models like Roles
db.sequelize.sync().then(() => { 
    console.log('Database sync') 
    // initial(); // 
})

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

app.listen(8080, () => {
    console.log('Server running on port 8000')
});

