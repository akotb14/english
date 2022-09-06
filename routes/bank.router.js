const router = require("express").Router();
const model = require("../models/bank");
const unit = require("../routes/units.router")
const isAdmin = require("../util/aurth");

router.get("/questionsbank", (req, res) => {
  res.render("enterpdf.ejs");
});
router.get("/bank/:edu/:grade", async (req, res) => {
  try {
    const data = await model.find({
      educetionlevel: req.params.edu,
      grade: req.params.grade,
    });
    res.render("bank.ejs", { data: data });
  } catch (err) {
    res.sendStatus(400);
  }
});
router.get("/addBank",isAdmin, async (req, res) => {
  try {
    const data = await model.find({});

    res.render("admin/addbank.ejs", { data: data });
  } catch (err) {
    console.log("p" + err)

    res.sendStatus(400);
  }
});
router.post('/addBank',isAdmin,unit.upload.single("pdf") ,async(req,res)=>{
    try{
        const m = new model({
            educetionlevel:req.body.educetionlevel,
            grade:req.body.grade,
            namePdf:req.body.namePdf,
            pdf:req.file.path
        })
     await m.save();
     res.redirect('/addBank')
    }catch(err){
        console.log("p" + err)
        res.sendStatus(400)
    }
})
router.get("/removeBank/:id", isAdmin,async (req, res) => {
    try {
      await model.findOneAndDelete({ _id: req.params.id });
      res.redirect("/addBank/");
    } catch (err) {
      console.log(err);
      res.sendStatus(404);
    }
  });
  module.exports = router;
