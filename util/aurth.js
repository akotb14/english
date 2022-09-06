const jwt = require("jsonwebtoken");
const isAdmin = (req, res, nxt) => {
  let student = jwt.verify(req.cookies.student, process.env.SecretPassword);
  if (student) {
    let admin = student.admin;
    if (admin == "true") {
      nxt();
    } else return res.sendStatus(404);
  } else {
    return res.sendStatus(404);
  }
};

module.exports = isAdmin;
