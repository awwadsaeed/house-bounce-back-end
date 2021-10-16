'use strict';
const UserModel = require('../models/userModel');

module.exports = async (req, res, next) => {

    //---chscking for the authorizatoin headers---//
    if (!req.headers.authorization) {
        next('Missing auth headers!');
        return;
    };


    //---making sure that the type of authorization is BEARER---//
    const headers = req.headers.authorization.split(' ');
    if (headers[0] !== 'Bearer') {
        next('Invalid auth headers!');
        return;
    };


    //---token authenticatoin---//
    try {
        const validatedUser = await UserModel.authenticateToken(headers.pop());
        req.user = validatedUser;
        next();
    } catch (error) {
        next(error.message);
    }
};