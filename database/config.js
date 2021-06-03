const mongoose = require("mongoose");

const dbConnection = async () => {
    try {

        await mongoose.connect( process.env.DB_CONNECTION_MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Online Database');

    } catch ( error ) {
        console.log( error );
        throw new Error('Error when initializing database');
    }
}

module.exports = {
    dbConnection
}