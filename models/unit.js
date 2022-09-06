const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  month: String,
  units: {
    type: [
      {
        unit: String,
        lesson: String,
        pdf: String,
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: "quiz" },
        isCheckQuiz: String,
        homeId: { type: mongoose.Schema.Types.ObjectId, ref: "quiz" },
        isCheckHome: String,
      },
    ],
    default: [],
  },

  grade: String,
  educetionlevel: String,
});

const model = mongoose.model("unit", schema);

module.exports = class Units {
  static getModel() {
    return model;
  }
  static async showData(edu, grd) {
    let data = await model.find({ educetionlevel: edu, grade: grd });
    return data;
  }

  static async addlesson(educetionlevel, grade, month, unit, lesson, pdf) {
    try {
      const checkMonth = await model.findOne({
        educetionlevel: educetionlevel,
        grade: grade,
        month: month,
      });
      if (!checkMonth) {
        let pushlesson = new model({
          educetionlevel: educetionlevel,
          grade: grade,
          month: month,
          units: [{ unit: unit, lesson: lesson, pdf: pdf }],
        });
        await pushlesson.save();
      } else {
        await model.updateOne(
          { educetionlevel: educetionlevel, grade: grade, month: month },
          { $push: { units: [{ unit: unit, lesson: lesson, pdf: pdf }] } }
        );
      }
    } catch (err) {
      
      console.log(err);
    }
  }
};
