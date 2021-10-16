'use strict';


//creating the data model for the houses on sale.

const mongoose = require('mongoose');

const houseSchema = mongoose.Schema({
    name: { type: String, required: true },
    houseType:{type:String,required:true},
    description: { type: String, required: true },
    sellingPrice: { type: Number, required: true },
    status: { type: String, required: true, default: 'Pending' },
    negotiability:{ type: String, required: true, enum:['Yes','No'] },
})

module.exports = houseSchema;