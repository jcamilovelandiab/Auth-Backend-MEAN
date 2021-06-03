const { response } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const createUser = async( req , res ) => {
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
        const token = await generateJWT( dbUser.id, name );

        // Create user in the db
        await dbUser.save();

        // Generate successful response
        return res.status(200).json({
            ok: true,
            uid: dbUser.id,
            name,
            token
        });
    } catch ( error ) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Please, contact the administrator'
        });
    }

};

const login = async( req , res = response ) => {
    const { email, password } = req.body;
    try {
        // Verify the email
        const dbUser = await User.findOne({ email });
        if( !dbUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'The email or password is incorrect'
            });
        }
        // Confirm if the password matches
        const validPassword = bcrypt.compareSync( password, dbUser.password );
        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'The email or password is incorrect'
            });
        }
        // Generate the Json Web Token
        const token = await generateJWT( dbUser.id, dbUser.name );
        return res.json({
            ok: true,
            uid:  dbUser.id,
            name: dbUser.name,
            token
        });
    } catch ( error ) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Please, contact the administrator'
        });
    }
};

const revalidateToken = async( req , res ) => {
    const { uid, name } = req;
    // Generate web token
    const token = await generateJWT( uid, name );
    return res.json({
        ok: true,
        uid,
        name,
        token
    });
};

module.exports = {
    createUser,
    login,
    revalidateToken
}