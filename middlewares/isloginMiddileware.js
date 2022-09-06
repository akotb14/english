const jwt = require('jsonwebtoken');
const valid =(req,res,nxt)=>{
    const token =req.cookies.student;
    if(token){
        const deName =  jwt.verify(req.cookies.student , process.env.SecretPassword)
        nxt();
    }else{
        return res.redirect('/login');
    }
}

module.exports =valid