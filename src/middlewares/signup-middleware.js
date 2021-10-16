'use strict';

const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const Interface = require('../interface/interface');

//---get user regester data from request body, hash password, save the user info to DB, and generate the token---//
module.exports = async (req, res, next) => {
    try {
        const { email, firstName, lastName, password, role, houses } = req.body;
        const data = { email, firstName, lastName, password, role, houses };
        
        const createdUser = await Interface.createUser(data);
        next()
    } catch (error) {
        next(error.message);
    };
};