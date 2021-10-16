'use strict';
const express = require('express');
const router = express.Router();
const signup = require('../middlewares/signup-middleware');
const basic = require('../middlewares/basic-auth-middleware');
const verify = require('../middlewares/verify-middleware');
require('dotenv').config();


//---sign up request---//
router.post('/signup',signup,(req,res)=>{
    try{
        res.status(201).json({message:'succesfully signedup'});
    }catch(error){
        res.status(418).json(error.message);
    }
});


//---sign in request---//
router.post('/signin',basic,(req,res)=>{
    try{
        res.status(200).json({token:req.token});
    }catch(error){
        res.status(401).json(error.message);
    }
});

//--- verification request ---//
router.get('/verification/:token',verify, async (req, res) => {
    try{
        
        return res.redirect(`http://localhost:5000/`);
    }catch(error){
        res.status(error.status).json({error:error.message});
    }
  });

module.exports = router;