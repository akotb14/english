const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  educetionlevel: String,
  grade: String,
  nameQuiz:String,
  month:String,
  unit:String,
  quiz: [
    { no: String, question: String, answer: [Array], correctAnswer: String },
  ],
  type:{
    type:String,
    enum:['quiz','exam','homework']
  },
  startTime: String,
  endTime: String,
  quizTime: String,
});
const model = mongoose.model("quiz", schema);
module.exports =  model
