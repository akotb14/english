const router = require("express").Router();
const contro = require("../controllers/quiz.contro");
const model = require("../models/quiz");
const isAdmin = require("../util/aurth");
const degreeQ = require("../models/degreeQuiz");
const student = require("../models/signup");

router.get("/admin/:type", isAdmin, contro.getQuiz);
router.post("/admin/:type", isAdmin, contro.addQuiz);

//router.all('/quizApp' ,contro.getQuizApp);
router.get("/openQuiz", contro.getOpenQuiz);
router.get("/startQuiz/:nameQuiz", async (req, res) => {
  try {
    let sda ="";
    let eda ="";
    const data = await model.findOne({ _id: req.params.nameQuiz });
    if(data){
       sda = new Date(data.startTime) 
       eda = new Date(data.endTime) 
    }
   
    if (data && (sda.getTime() <= Date.now() && eda.getTime() > Date.now())) {
      res.render("startQuiz.ejs");
    } else {
      console.log("s")
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err)
    res.sendStatus(404);
  }
});
router.post("/startQuiz/:nameQuiz", contro.startQuiz);
router.get("/examApp/:nameQuiz", contro.g);

router.post("/examApp/:nameQuiz", contro.postQuizApp);
//router.get('/qw' ,contro.getqw)
router.get("/showStudentsDegree/:type", isAdmin, async (req, res) => {
  try {
    let filter = req.query.group;
    console.log(req.params.type);
    let q =
      filter == "All" || !filter
        ? { path: "student", options: { sort: { group: 1 } } }
        : { path: "student", match: { group: filter } };
    const quizDegree = await degreeQ
      .find({ type: req.params.type })
      .populate({ path: "quiz" })
      .populate(q);
    console.log(quizDegree);
    
    res.render("admin/showStudDegree.ejs", {
      data: quizDegree,
      type: req.params.type,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(404);
  }
});
router.get("/editExam/:id", isAdmin, async (req, res) => {
  try {
    const findHome = await model.findOne({ _id: req.params.id });
    if (findHome) {
      const showQuestion = await model.findOne({ _id: req.params.id });
      res.render("admin/editexam.ejs", {
        data: findHome,
        question: showQuestion.quiz,
      });
    } else {
      res.redirect("/admin/exam");
    }
  } catch (err) {
    res.sendStatus(404);
  }
});
router.post("/editExam/:id", isAdmin, async (req, res) => {
  try {
    console.log(req.body);
    let edu = req.body.educetionlevel;
    let grade = req.body.grade;
    let nameQuiz = req.body.nameQuiz;

    const showQuestion = await model.findOne({ _id: req.params.id });
    if (
      edu != showQuestion.educetionlevel ||
      grade != showQuestion.grade ||
      nameQuiz != showQuestion.nameQuiz ||
      req.body.startTime != showQuestion.startTime ||
      req.body.endTime != showQuestion.endTime ||
      req.body.quizTime != showQuestion.quizTime
    ) {
      console.log("up");
      await model.findOneAndUpdate(
        { _id: req.params.id },
        {
          educetionlevel: req.body.educetionlevel,
          grade: req.body.grade,
          nameQuiz: req.body.nameQuiz,
          startTime:req.body.startTime,
          endTime:req.body.endTime,
          quizTime:req.body.quizTime 
        }
      );
      res.redirect("/editExam/" + req.params.id);
    } else {
      console.log("add question");
      await model.updateOne(
        {
          _id: req.params.id,
          educetionlevel: req.body.educetionlevel,
          grade: req.body.grade,
          nameQuiz: req.body.nameQuiz,
          startTime:req.body.startTime,
          endTime:req.body.endTime,
          quizTime:req.body.quizTime 
        },
        {
          $push: {
            quiz: [
              {
                no: req.body.no,
                question: req.body.question,
                answer: [req.body.answer],
                correctAnswer: req.body.correctAnswer,
              },
            ],
          },
        }
      ); 
      res.redirect("/editExam/" + req.params.id);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
}); 
router.get("/removeExam/:id", isAdmin, async (req, res) => {
  try {
    await model.findOneAndDelete({ _id: req.params.id });
    res.redirect("/editExam/" + req.params.id);
  } catch (err) {
    console.log(err);
    res.sendStatus(404);
  }
});
router.get("/removeQuestionOfExam/:i/:id", isAdmin, async (req, res) => {
  try {
    await model.updateOne(
      {
        _id: req.params.i,
      },
      {
        $pull: {
          quiz: {
            _id: req.params.id,
          },
        },
      }
    ); 
    res.redirect("/editExam/" + req.params.i);
  } catch (err) {
    console.log(err);
    res.sendStatus(404);
  }
});
module.exports = router;
