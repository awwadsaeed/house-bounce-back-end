'use strict';
const mongoose = require('mongoose');


//creating the data model for the houses on sale.
const houseSchema = mongoose.Schema({
    ownerName: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    type: { type: String, required: true, enum: ['House', 'Appartment'] },
    address: { type: String, required: true },
    description: { type: String, required: true },
    sellingPrice: { type: String, required: true },
    status: { type: String, required: true, default: 'Pending', enum:['Accepted','Pending','Regected'] },
    negotiable: { type: String, required: true, enum: ['Yes', 'No'] },
});

module.exports = houseSchema;