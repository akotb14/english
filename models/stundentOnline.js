const mongoose = require('mongoose')
const schema =new mongoose.Schema ({
    fullName:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        maxLength: 12,
        minLength:11,
        required:true
    },parentPhone:{
        type:String,
        maxLength: 12,
        minLength:11,
        required:true
    },government:{type:String,maxLength:50}
    ,grade:{
        type:String,
        required:true,
    },
})
module.exports=  mongoose.model('studentOnline' ,schema);