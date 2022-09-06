const mongoose = require("mongoose");
const signupScheme = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  cardNumber: {
    type: String,
    unique: true,
  },
  phoneNumber: {
    type: String,
  
  },
  parentPhone: {
    type: String,
   
  },
  government: { type: String,  },
  grade: {
    type: String,
    enum: ["1st", "2nd", "3rd"],
  },
  password: {
    required: true,
    type: String, 
  },
  group: String,
  educetionlevel: {
    type: String,
  },
  admin: String,
});
module.exports = mongoose.model("auth", signupScheme);
