'use strics';
const mongoose = require('mongoose');
const houseSchema = require('./houseModel');

//------creating the data model for the user whether its an admin or a house seller------//
const userSchema = mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: {
        type: String,
        required: true,
        default: 'seller',
        enum: ['seller', 'admin'],
    },
    houses:[houseSchema],
},
    {
        toJSON: { virtuals: true }
    });


//--------adding the capabilities of sellers and admins-------//
userSchema.virtuals('abilities').get(function (){
    const acl = {
        seller:['read','create','delete','updatePrice'],
        admin:['read','create','delete','updateStatus']

    };
    return acl[this.role];
});

//-----creating the user model------//
const userModel = mongoose.Model('user',userSchema);

module.exports = userModel;