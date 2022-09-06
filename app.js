const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const session = require("express-session");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

//import db
const connectDatabase = require("./models/connect_db");
connectDatabase.db();
const bcrypt = require("bcrypt")
const usermodel = require("./models/signup");
async function addAdmin (name , card ,phone){
  let salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(`admin${card}`, salt);
      

  const findAdmin = await usermodel.findOne({phoneNumber:phone})
 if(!findAdmin ){
  const admin = new usermodel({
    fullName:name,
    phoneNumber:phone,
    admin: "true",
    cardNumber:card,
    password:hashpassword,
  })
  await admin.save()
 }
}

addAdmin("admin1",123456789101122 ,123456789101122)
addAdmin("admin",12345678910,12345678910) 

// import routes
const loginRoute = require("./routes/login.router");
const signupRoute = require("./routes/signup.router");
const indexRoute = require("./routes/home.router");
const unitRoute = require("./routes/units.router");
const studentRoute = require("./routes/dashboard");
const quizRoute = require("./routes/exam.router");
const quiza = require("./routes/quiz.router");
const homework = require("./routes/homework.router");
const loginOnline = require("./routes/studentOnline.route");
const showAnswer = require("./routes/showAnswer.router");
const bank = require("./routes/bank.router");

const port = process.env.PORT || 5000;

const date = new Date();
app.use(cors({}));
app.use(express.static("public"));
app.use(express.static("documantion"));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("template engine", "ejs");
app.use(
  session({
    secret: "ahmed14252",
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());
const contentSecurityPolicy = require("helmet-csp");
const isAdmin = require("./util/aurth");
const isLogin = require("./util/auth");

app.get("/student", isAdmin, async (req, res) => {
  try {
    let filter = req.query.group;
    let q = filter == "All" || !filter ? null : { group: filter };
    res.render("admin/users.ejs", {
      student: await usermodel
        .find(q)
        .sort({ admin: -1, educetionlevel: 1, grade: 1, group: -1 }).where({cardNumber:{$ne:123456789101122}}),
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

//use route

app.use("/", loginRoute);
app.use("/", signupRoute);
app.use("/", studentRoute);
app.use("/", indexRoute);
app.use("/", loginOnline);

app.use("/", isLogin, quiza);
app.use("/", isLogin, homework);
app.use("/", isLogin, showAnswer);
app.use("/", isLogin, bank);
app.use("/", isLogin, quizRoute);
app.use("/", isLogin, unitRoute.router);
app.get("/Secondary", isLogin,(req, res) => {
  try {
    res.render("grade.ejs");
  } catch (e) {
    res.sendStatus(404);
  }
});
app.get("/Preparatory", isLogin, (req, res) => {
  res.render("prepgrade.ejs");
});
//listen server
app.listen(port, () => {
  console.log("server is connected" + port);
});
