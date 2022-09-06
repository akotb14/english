const Unit = require("../models/unit");
const quiz = require("../models/quiz");

const getData = async (req, res) => {
  try {
    let edu = req.params.edu;
    let grd = req.params.grd;
    let data = await Unit.showData(edu, grd);
    res.render("month.ejs", { data: data });
  } catch (e) {
    console.log(e);
    res.sendStatus(404)
  }
};

const addlesson = async (req, res) => {
  try {

    await Unit.addlesson(
      req.body.educetionlevel,
      req.body.grade,
      req.body.month,
      req.body.unit,
      req.body.lesson,
      req.file.path
    );
    res.redirect("/lesson");
  } catch (err) {
    res.sendStatus(400);
  }
};
const getlesson = async (req, res) => {
  try {
    const lesson = await Unit.getModel().find({});
    res.render("admin/lesson.ejs", {
      lesson: lesson,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(404)

  }
};
const getContent = async (req, res) => {
  try {
    let edu = req.params.edu;
    let grade = req.params.grade;
    let month = req.params.month;
    let unit = req.params.unit;
    
    let content = await Unit.getModel().findOne({
      educetionlevel: edu,
      grade: grade,
      month: month,
    });
    let c = "";
    if (content) {
      c = content.units.find((val) => {
        return val["unit"] == unit;
      });
    } else {
      c = "";
    }
    let q = " " ;
     q = await quiz.findOne({
      educetionlevel: edu,
      grade: grade,
      month: month,
      unit: unit,
      type: "quiz",
    });
    console.log(q);
    let id = " ";
    if(q){
       id = q._id 
    }

    res.render("units.ejs", { data: c, url : id});
  } catch (err) {
    console.log("a"+err);
    res.sendStatus(400);
  }
};

module.exports = { getData, addlesson, getlesson, getContent };
