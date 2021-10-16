'use strics';
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const houseSchema = require('./houseModel');
const { boolean } = require('webidl-conversions');
const SECRET = process.env.SECRET;

//------creating the data model for the user whether its an admin or a house seller------//
const userSchema = mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    verified:{ 
        type: Boolean, 
        required: true,
        default:false,
        enum:[true,false],
    },
    role: {
        type: String,
        required: true,
        default: 'seller',
        enum: ['seller', 'admin'],
    },
    houses: [houseSchema],
},
    {
        toJSON: { virtuals: true }
    });


//--------adding the capabilities of sellers and admins-------//
userSchema.virtual('abilities').get(function () {
    const acl = {
        seller: ['read', 'create', 'delete', 'updatePrice'],
        admin: ['read', 'delete', 'updateStatus']
    };
    return acl[this.role];
});




//-------- basic authentication of the login (email, password)---------//
userSchema.statics.authenticateBasic = async (email,password) => {
    
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error('User Not Registered');
        };
        const validated = await bcrypt.compare(password, user.password);
        if (!validated) {
            throw new Error('Invalid Email Or Password');
        };
        if (!user.verified) {
            throw new Error('User Not Verified');
        };
        return user;
    } catch (e) {
       throw new Error(e.message);
    };
};


//----- token generation -----//
userSchema.statics.generateToken = (user) => {
    let data = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        abilities: user.abilities
    };
    return jwt.sign(data, SECRET);
};


//----- token verificaiton ------//
userSchema.statics.authenticateToken = async (token) => {
    try {
        const initialData = jwt.verify(token, SECRET);
        const user = await userModel.findOne({ email: initialData.email });
        if (user) {
            return user;
        }
        throw new Error('User Not Registered');
    } catch (e) {
        throw new Error(e.message);
    };
}

//-----creating the user model------//
const userModel = mongoose.model('user', userSchema);


module.exports = userModel;