'use strict';

const jwt = require('jsonwebtoken');
const Interface = require('../interface/interface');
require('dotenv').config();
const VERIFY_SECRET = process.env.VERIFY_SECRET;
module.exports = async (req,res,next)=>{
    try {
        //---checking that request params exists---//
        //---if they exist verify user---//
        if(req.params.token){
            const { user } = jwt.verify(req.params.token, VERIFY_SECRET);
            let verified = await Interface.verify(user.email);
        }
        next();
      } catch (e) {
       next(e.message);
    }
}