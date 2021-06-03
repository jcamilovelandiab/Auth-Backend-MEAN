const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, login, revalidateToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

// Register a new user
router.post( '/register', [
    check('name', 'The name is required' ).not().isEmpty(),
    check( 'email', 'The email is required and must be valid' ).isEmail(),
    check( 'password', 'The password must be greater than or equal to 6' ).isLength(6),
    validateFields
], createUser );

// Login
router.post( '/', [
    check( 'email', 'The email is required and must be valid' ).isEmail(),
    check( 'password', 'The password must be greater than or equal to 6' ).isLength(6),
    validateFields
], login );

// Validate token
router.get( '/renew', revalidateToken );

module.exports = router;