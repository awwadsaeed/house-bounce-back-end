'use strict';

const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();

const VERIFY_SECRET = process.env.VERIFY_SECRET;
const nodemailer = require('nodemailer');

class Interface {
  //---thist function create the user into the DB---//
    static createUser = async (userData) => {
        const {email, firstName, lastName, password, role, houses } = userData;
        let testUser = await UserModel.findOne({ email });
        if (testUser) {
            throw new Error('user already exists');
        };
        const hashedPassword = await bcrypt.hash(password, 8);
        const data = { email, firstName, lastName, password: hashedPassword, role, houses };
        const user = new UserModel(data);
        const record = await user.save();

        //---creating the verification token---//
        let token = jwt.sign(
            {
              user: {
                email: record.email,
              },
            },
            VERIFY_SECRET,
            {
              expiresIn: '3d',
            }
          );


        //---creating the trasporter via nodemailer to enable us to send emails using provided service---//
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_USER, 
                pass: process.env.PASSWORD, 
            },
        });
        let url = `${process.env.REDIRECT_NODEMAILER}/auth/verification/${token}`;


        //---send mail with defined transport object---//
        await transporter.sendMail({
            from: '"house bounce" <socialize401@gmail.com>', // sender address
            to: `${record.email}`, // list of receivers
            subject: 'verify your email to login', // Subject line
            text: '',
            html: `<b> Welcom to socialize </b> <br> <p> to confirm your email follow this link </p>
           <br><a href="${url}">${url}</a>`, // email body in html format
        });
        return record;
    };
//--- this function verifies the user ---//
    static verify = async (email)=>{
      try{
        let userData = await UserModel.findOne({email});
        userData.verified = true;
        let record = await userData.save();
        return record;
      }catch(error){
        throw new Error(error.message);
      };
    };
}


module.exports = Interface;