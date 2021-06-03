const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
require('dotenv').config();

// Create the express server/application
const app = express();

// Database
dbConnection();

//Middlewares
// Public directory
app.use( express.static('public') );
// Cors
app.use( cors() );
// Reading and parsing of the body
app.use( express.json() );
// Routes
app.use('/api/auth', require('./routes/auth') );

app.listen( process.env.PORT, () => {
    console.log(`Server running on port ${ process.env.PORT }`);
});