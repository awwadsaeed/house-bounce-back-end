'use strict';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRouter = require('./src/routers/auth-router');
const reqRouter = require('./src/routers/request-router');
require('dotenv').config();


//-----setting up the server-----//
const app = express();
app.use(express.json());
app.use(cors());
app.get('/',(req,res)=>{
    res.send('I AM ALIVE');
});
//---setting up routing---//
app.use('/auth',authRouter);
app.use('/req',reqRouter);

//----setting up environment variables----//
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;


//----establishing connection with database and starting the server----//
mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(PORT, () => {
        console.log('listening on port ',PORT);
    });
}).catch((e) => {
    console.log(e.message);
});