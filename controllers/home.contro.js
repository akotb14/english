const jwt = require("jsonwebtoken");
const showEducationLevel = async (req, res) => {
  try {
    let deName;
    if (req.cookies.student) {
      deName = jwt.verify(req.cookies.student, process.env.SecretPassword);
      console.log(deName);
    } else {
      deName = "";
    }
    let isAdmin = "";
    if (deName.admin == "true") {
      isAdmin = deName.admin;
    }
    res.render("index.ejs", { name: deName.nameStudent, isAdmin: isAdmin });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { showEducationLevel };
