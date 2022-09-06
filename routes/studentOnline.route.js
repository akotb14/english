const route = require("express").Router();
const model = require("../models/stundentOnline");
const isAdmin = require("../util/aurth")
var csrf = require("csurf");
const csrfProtect = csrf({ cookie: true });

route.get("/studentOnline",csrfProtect, (req, res) => {
  res.render("loginOnline.ejs",{csrfToken: req.csrfToken(),err:req.flash('err')});
});
route.post("/studentOnline",csrfProtect, async (req, res) => {
  try {
    const stu = new model({
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
      parentPhone: req.body.parentPhone,
      government: req.body.government,
      grade: req.body.grade,
    });
    await stu.save();
    res.redirect("/studentOnline");
  } catch (err) {
    req.flash('err', "you entered wrong fields")
    res.redirect('/studentOnline')
  }
});
route.get('/admin/studentOnline', isAdmin, async (req,res)=>{
    try{
        let mo = await model.find({});
        res.render('admin/onlinestudent.ejs' , {student:mo})
    }catch(err){
     res.sendStatus(400)
    }
})
module.exports = route;
