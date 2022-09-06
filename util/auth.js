const jwt = require("jsonwebtoken");
const isLogin = (req, res, nxt) => {
try{
    let student = jwt.verify(req.cookies.student, process.env.SecretPassword);
    if (student) {
        nxt();
      
    } else {
      return res.redirect("/");
    }
}catch(err){
    res.redirect("/");
}
};

module.exports = isLogin;