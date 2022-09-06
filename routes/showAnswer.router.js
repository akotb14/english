const route = require("express").Router();
const quiz = require("../models/quiz");
const checkIsExamed = require("../models/degreeQuiz.js")
const jwt = require('jsonwebtoken')
route.get("/showAnswer/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let student = jwt.verify(req.cookies.student, process.env.SecretPassword);
    const checkExamed = await checkIsExamed.findOne({student:student.studentCard,quiz:id})
    const modalQuiz = await quiz.findOne({ _id: id });
    let  findhome =""
    if(modalQuiz.type == "homework"){
        findhome = await checkExamed.findOne({quiz:id , type:"homework" , student:student.studentCard})
        
    }
    if (modalQuiz && checkExamed) {
      res.render("showAnswer.ejs", { data: modalQuiz });
    } else {
      res.status(404).send("Not found anything in this page");
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(404);
  }
});
route.get("/showAnswerHomework/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let student = jwt.verify(req.cookies.student, process.env.SecretPassword);
    const checkExamed = await checkIsExamed.findOne({student:student.studentCard,quiz:id})
    const modalQuiz = await quiz.findOne({ _id: id });
    let  findhome =""
    if(modalQuiz.type == "homework"){
        findhome = await checkIsExamed.findOne({quiz:id , type:"homework" , student:student.studentCard})
        
    }
    if (modalQuiz && checkExamed) {
      res.render("showAnswerhome.ejs", { data: findhome });
    } else {
      res.status(404).send("Not found anything in this page");
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(404);
  }
});
module.exports = route;
