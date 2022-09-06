const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  educetionlevel: String,
  grade: String,
  namePdf: String,
  pdf: String,
});
module.exports =mongoose.model("bank",schema)