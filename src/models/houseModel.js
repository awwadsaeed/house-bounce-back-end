'use strict';
const mongoose = require('mongoose');


//creating the data model for the houses on sale.
const houseSchema = mongoose.Schema({
    name: { type: String, required: true },
    address:{type:String,required:true},
    description: { type: String, required: true },
    sellingPrice: { type: Number, required: true },
    status: { type: String, required: true, default: 'Pending' },
    negotiability:{ type: String, required: true, enum:['Yes','No'] },
    houseID:{type:String,required: true},
});

module.exports = houseSchema;