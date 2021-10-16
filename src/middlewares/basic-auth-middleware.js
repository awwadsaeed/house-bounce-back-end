'use strict';
const UserModel = require('../models/userModel');
const base64 = require('base-64');

module.exports = async (req, res, next) => {

    //---chscking for the authorizatoin headers---//
    if (!req.headers.authorization) {
        next('Missing Authentication Headers');
        return;
    };


    //---making sure that the type of authorization is BASIC---//
    let authHeaders = req.headers.authorization.split(' ');
    if (authHeaders[0] !== 'Basic') {
        next('Malformed Authentication Header');
        return;
    };
    
    //---decoding headers and doing the basic authentication and procceeding to generate the token---//
    const [email, password] = base64.decode(authHeaders.pop()).split(':');
    try {
        const validatedUser = await UserModel.authenticateBasic(email, password);
        req.token = UserModel.generateToken(validatedUser);
        next();
    } catch (error) {
        next(error.message);
    };
};