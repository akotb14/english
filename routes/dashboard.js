const router = require("express").Router();
const contro = require("../controllers/signup.contr");
const isAdmin = require("../util/aurth");

router.get("/dashboard", isAdmin ,async (req, res) => {
  try {
    const data = await contro.getstudent();
    res.render("admin/dashboard.ejs", { student: data });
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
