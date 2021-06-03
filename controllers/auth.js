const { response } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createUser = async ( req , res ) => {
    const { email, name, password } = req.body;

    try {
        // Verify the email
        const user = await User.findOne({ email });
        if( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'An user already exists with this email'
            });
        }
        // Create user with the model
        const dbUser = new User( req.body );

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        dbUser.password = bcrypt.hashSync( password, salt );

        // Generate JWT

        // Create user in the db
        await dbUser.save();

        // Generate successful response
        return res.status(200).json({
            ok: true,
            uid: dbUser.id,
            name
        });
    } catch ( error ) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Please, contact the administrator'
        });
    }

};

const login = ( req , res = response ) => {
    const { email, password } = req.body;
    return res.json({
        ok: true,
        msg: 'Login'
    });
};

const revalidateToken = ( req , res ) => {
    return res.json({
        ok: true,
        msg: 'Validate token'
    });
};

module.exports = {
    createUser,
    login,
    revalidateToken
}