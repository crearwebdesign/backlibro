// 7753191

require('dotenv').config(); // para tomar las variables que estan en el archivo .env

const express = require('express');


const cors = require('cors');

const {dbConnection} = require('./database/config');

// crear el servidor express
const app = express();

// configurar CORS
app.use(cors());

// Carpeta Publica
app.use(express.static('public'));

// lectura y parseo del body
app.use(express.json());

// base de datos
dbConnection();

// rutas 

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales',require('./routes/hospitales'));
app.use('/api/medicos',require('./routes/medicos'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/todo',require('./routes/busquedas'));
app.use('/api/upload',require('./routes/uploads'));


// el process.env.PORT viene del require('dotenv')
app.listen(process.env.PORT, () =>{
    console.log('Server running at port ' + process.env.PORT)
})