// backend/utils/db.js

// Importa MySQL2 para conexión a base de datos
const mysql = require('mysql2');
require('dotenv').config();

// Crea una conexión con la base de datos MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Establece la conexión y reporta errores si hay
connection.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos MySQL');
  }
});

module.exports = connection;
