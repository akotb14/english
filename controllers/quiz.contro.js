const model = require("../models/quiz");
const user = require("../models/signup");
const unit = require("../models/unit");
const jwt = require("jsonwebtoken");
const degreeModel = require("../models/degreeQuiz");
const addQuiz = async (req, res) => {
  try {
    const checkQuiz = await model.findOne({
      educetionlevel: req.body.educetionlevel,
      grade: req.body.grade,
      nameQuiz: req.body.nameQuiz,
      type: req.params.type,
    });
    const checkUnit = await unit.getModel().findOne({
      educetionlevel: req.body.educetionlevel,
      grade: req.body.grade,
      "units.unit": req.body.unit,
      month: req.body.month,
    });

    if (!checkQuiz) {
      console.log("ds");
      let quiz = "";
      if (req.params.type == "exam") {
        quiz = new model({
          educetionlevel: req.body.educetionlevel,
          grade: req.body.grade,
          nameQuiz: req.body.nameQuiz,
          quiz: [
            {
              no: req.body.no,
              question: req.body.question,
              answer: [req.body.answer],
              correctAnswer: req.body.correctAnswer,
            },
          ],
          unit: req.body.unit,
          month: req.body.month,
          type: req.params.type,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          quizTime: req.body.quizTime,
        });
        await quiz.save();
      } else if (
        (req.params.type == "homework" || req.params.type == "quiz") &&
        checkUnit
      ) {
        let val = "";
        val = checkUnit.units.find((val, index) => {
          if (val.unit == req.body.unit) {
            return checkUnit.units[index];
          }
        });
        console.log("units" + val);
        if (val != "") {
          if (req.params.type == "quiz" && val.quizId == undefined) {
            quiz = new model({
              educetionlevel: req.body.educetionlevel,
              grade: req.body.grade,
              nameQuiz: req.body.nameQuiz,
              quiz: [
                {
                  no: req.body.no,
                  question: req.body.question,
                  answer: [req.body.answer],
                  correctAnswer: req.body.correctAnswer,
                },
              ],
              unit: req.body.unit,
              month: req.body.month,
              type: req.params.type,
              startTime: req.body.startTime,
              endTime: req.body.endTime,
              quizTime: req.body.quizTime,
            });
            await quiz.save();
            console.log(quiz._id);
            let content = await unit.getModel().findOne({
              educetionlevel: req.body.educetionlevel,
              grade: req.body.grade,
              month: req.body.month,
            });
            let c = "";
            if (content) {
              c = content.units.find((val) => {
                return val["unit"] == req.body.unit;
              });
            } else {
              c = "";
            }
            console.log("ahmed" + c);
            //update units

            let run = await unit.getModel().findOneAndUpdate(
              {
                educetionlevel: req.body.educetionlevel,
                grade: req.body.grade,
                month: req.body.month,
                units: { $elemMatch: { unit: req.body.unit } },
              },
              { $set: { "units.$.quizId": quiz.id } }
            );
            console.log("run" + run);
          } else if (req.params.type == "homework" && val.homeId == undefined) {
            quiz = new model({
              educetionlevel: req.body.educetionlevel,
              grade: req.body.grade,
              nameQuiz: req.body.nameQuiz,
              quiz: [
                {
                  no: req.body.no,
                  question: req.body.question,
                  answer: [req.body.answer],
                  correctAnswer: req.body.correctAnswer,
                },
              ],
              unit: req.body.unit,
              month: req.body.month,
              type: req.params.type,
              startTime: req.body.startTime,
              endTime: req.body.endTime,
              quizTime: req.body.quizTime,
            });
            await quiz.save();
            console.log(quiz._id);
            let content = await unit.getModel().findOne({
              educetionlevel: req.body.educetionlevel,
              grade: req.body.grade,
              month: req.body.month,
            });
            let c = "";
            if (content) {
              c = content.units.find((val) => {
                return val["unit"] == req.body.unit;
              });
            } else {
              c = "";
            }
            console.log("ahmed" + c);
            let run = await unit.getModel().findOneAndUpdate(
              {
                educetionlevel: req.body.educetionlevel,
                grade: req.body.grade,
                month: req.body.month,
                units: { $elemMatch: { unit: req.body.unit } },
              },
              { $set: { "units.$.homeId": quiz.id } }
            );
          }
        }
      }

      res.redirect(`/admin/${req.params.type}`);
    } else {
      console.log("ddssds");

      res.redirect(`/admin/${req.params.type}`);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

const getQuiz = async (req, res) => {
  if (
    req.params.type == "quiz" ||
    req.params.type == "exam" ||
    req.params.type == "homework"
  ) {
    const data = await model.find({ type: req.params.type });
    res.render(`admin/${req.params.type}.ejs`, { data });
  } else {
    res.sendStatus(400);
  }
};
let d = 0;
let index = 0;
let isStart = false;
let countCorrect = 0;
let deName = "";
let arrAns = [];

const g = async (req, res) => {
  try {
    let id = req.params.nameQuiz;

    const data = await model.findOne({
      _id: id,
    });
    let sda = new Date(data.startTime);
    let eda = new Date(data.endTime);
    if (data && sda.getTime() <= Date.now() && eda.getTime() > Date.now()) {
      res.render("showQuestion.ejs", {
        quiz: data,
        d,
        index: index,
        s: isStart,
      });
    } else {
      console.log("s");
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(404);
  }
};

const getOpenQuiz = async (req, res) => {
  let data = "";
  const dateNow = new Date();
  let degree = "";
  if (req.cookies.student) {
    deName = jwt.verify(req.cookies.student, process.env.SecretPassword);
    degree = await degreeModel.find({
      student: deName.studentCard,
      type: "exam",
    });
    console.log("dddd" + degree);
    data = await model.find({
      educetionlevel: deName.educetionlevel,
      grade: deName.grade,
      type: "exam",
    });
  }
  arrAns=[]
  index=0;
  d=1;
  res.render("openQuiz.ejs", {
    quizzes: data,
    dateNow: dateNow,
    degree: degree,
  });
};
const postQuizApp = async (req, res) => {
  try {
    let correctAnswer ="";
    let name = req.params.nameQuiz;
    let student = jwt.verify(req.cookies.student, process.env.SecretPassword);

    const data = await model.findOne({
      _id: name,
    });
   
    if (data) {
      if (isStart) {
        

        if (req.body.action == "back") {
          res.redirect("/examApp/" + data._id);
          index--;
         

          if (data["quiz"][index]["correctAnswer"] == arrAns[index]) {
            countCorrect--;
          }
          
          arrAns.pop();
          
        } else {
          correctAnswer = data["quiz"][index]["correctAnswer"];
          arrAns.push(req.body.answer);
          console.log("arr "+ arrAns)
          if (index < data["quiz"].length - 1) {
            if (req.body.answer == correctAnswer) {
              countCorrect++;
              res.redirect("/examApp/" + data._id);
            } else {
              res.redirect("/examApp/" + data._id);
            }
            console.log("cc " + countCorrect);
            console.log("index " + index);

            index++;
          } else {
            if (req.body.answer == correctAnswer) {
              countCorrect++;
            }

            const checkCount = await degreeModel.findOne({
              quiz: data.id,
              student: student.studentCard,
              isCheck: "1",
              type: "exam",
            });
            if (checkCount && checkCount.totalDegree == null) {
              let up = await degreeModel.findOneAndUpdate(
                {
                  quiz: data._id,
                  student: student.studentCard,
                  isCheck: "1",
                  type: "exam",
                },
                { totalDegree: countCorrect }
              );
            }
            isStart = false;

            countCorrect = 0;
            d = 1;
            arrAns =[];
            index = 0;
            res.redirect("/openQuiz");
          }
        }
      } else {
        arrAns =[];
        index=0;
        isStart = false;
        res.redirect("/openQuiz");
      }
    } else {
      arrAns =[];
      index=0;
      isStart = false;
      console.log(err);

      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(404);
  }
};
const startQuiz = async (req, res) => {
  try {
    console.log(req.body.btn)
    if(req.body.btn == "continue"){
    let name = req.params.nameQuiz;
    const qutime = await model.findOne({ _id: name, type: "exam" });
    if (qutime) {
      let student = jwt.verify(req.cookies.student, process.env.SecretPassword);
      const checkDegree = await degreeModel.findOne({
        isCheck: "1",
        quiz: qutime._id,
        student: student.studentCard,
        type: "exam",
      });

      if (qutime && !checkDegree) {
        const deg = new degreeModel({
          isCheck: "1",
          quiz: name,
          student: student.studentCard,
          totalDegree: null,
          type: "exam",
        });

        await deg.save();
        let q = qutime.quizTime;
        const date = new Date();
        const dateQ = new Date();
        dateQ.setHours(
          dateQ.getHours() + parseInt(q.split(":")[0]),
          dateQ.getMinutes() + parseInt(q.split(":")[1])
        );
        d = 0;
        d = (dateQ.getTime() - date.getTime()) / 1000;
        isStart = true;

        let counter = setInterval(() => {
          d--;
          if (d <= 0) {
            console.log("quiz is ended");
            isStart = false;
            index = 0;
            arrAns =[];
            countCorrect = 0;
            clearInterval(counter);
          }
        }, 1000);
        res.redirect("/examApp/" + qutime._id);
      } else {
        d = 1;
        arrAns =[];
        res.status(400).send("<h1>you cant entered Exam agian </h1>");
      }
    } else {
      res.sendStatus(404);
    }
  }
  } catch (err) {
    res.sendStatus(404);
  }
};
module.exports = {
  addQuiz,
  getQuiz,
  postQuizApp,
  g,
  getOpenQuiz,
  startQuiz,
};
