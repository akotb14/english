const router = require("express").Router();
const contro = require("../controllers/home.contro");

router.get("/", contro.showEducationLevel);
router.get("/logout", (req, res) => {
  res.clearCookie("student");
  res.redirect("/");
});
module.exports = router;
