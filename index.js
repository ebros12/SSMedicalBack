const express = require('express');
require('dotenv').config(); 
var cors = require('cors')
const path = require('path');

//Creando el servidor de express
const app = express();

app.use(cors())

//Durectirio Público
app.use(express.static("public"));
const absolutePath = path.join(__dirname, 'public', 'uploads');
app.use('/uploads', express.static(absolutePath));


//Lectura y parseo del body
app.use(express.json());

//Rutas

app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/pacientes', require('./routes/pacientes'));
app.use('/procedimientos', require('./routes/procedimientos'));


app.listen(process.env.PORT, () => { 
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`)
});

