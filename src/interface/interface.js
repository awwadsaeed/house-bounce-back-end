'use strict';

const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const VERIFY_SECRET = process.env.VERIFY_SECRET;
const nodemailer = require('nodemailer');


class Interface {
  //---thist function create the user into the DB---//
  static createUser = async (userData) => {
    const { email, firstName, lastName, password, role, houses } = userData;
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
  static verify = async (email) => {
    try {
      let userData = await UserModel.findOne({ email });
      userData.verified = true;
      let record = await userData.save();
      return record;
    } catch (error) {
      throw new Error(error.message);
    };
  };

  //--- get the house requests for the seller/admin ---//
  static read = async (user) => {

    //--if user is a seller--//
    if (user.role == 'seller') {
      return user.houses;
    };

    //---if user is admin---//
    if (user.role == 'admin') {
      const allUsers = await UserModel.find({});
      let allHouses = [];
      //---get all houses for the admin---//
      allUsers.forEach((user) => {
        allHouses = [...allHouses, ...user.houses]
      });
      user.houses = allHouses;
      return user.houses;
    }
  };

  //--- create the house sale for the user(seller) ---//
  static create = async (email, house) => {
    console.log(house);
    let userInfo = await UserModel.findOne({ email });
    let houseData = house;
    houseData.ownerEmail = email;
    houseData.ownerName = `${userInfo.firstName} ${userInfo.lastName}`;
    userInfo.houses.push(houseData);
    let savedData = await userInfo.save();
    return savedData.houses;
  };


  //--- update the price for the house if its negotiable ---//
  static updatePrice = async (user, id, newPrice) => {
    console.log(user);
    const newHouses = user.houses.map((house) => {
      if (house._id == id) {
        house.sellingPrice = newPrice;
      };
      return house;
    });
    
    user.houses = newHouses;
    const newData = await user.save();
    return newData.houses;
  };


  //--- delete the house add for the user (seller or admin) ---//
  static delete = async (houseID, email) => {
    try {
      const user = await UserModel.findOne({ email });
      let updatedHouses = user.houses.filter((house) => {
        if (house._id.toString() !== houseID) {
          return house;
        }
      });
      user.houses = updatedHouses;
      const updatedUser = await user.save();
      return updatedUser.houses;
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }

  }

  //--- update the status of the add by the adming ---//
  static updateStatus = async (hosueID, email, stat) => {
    try {
      const user = await UserModel.findOne({ email });
      const modifiedHouses = user.houses.map((house) => {
        if (house._id.toString() === hosueID) {
          house.status = stat;
        }
        return house
      });
      user.houses = modifiedHouses;
      const modifiedUser = await user.save();
      return modifiedUser.houses;
    } catch (e) {
      throw new Error(e.message);
    }

  }



}


module.exports = Interface;