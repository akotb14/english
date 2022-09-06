const validator = require("../util/validSignup");
module.exports =(req,res,nxt)=>{
try{
    let valid = validator(req.body);
 if(valid){
    req.valid =1;
    nxt();
 }else{
    req.flash("errorMsg",validator.errors);
    res.redirect('/sign')
 }}catch(err){
   console.log(err)
 }
}