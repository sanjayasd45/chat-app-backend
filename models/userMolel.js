const { hash } = require("bcryptjs")
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")

const userModel = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    username : {
        type : String, 
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    profilePicture: {
        type: String,
        default: ''
    },
    previousChats : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    socketId : {
        type : String,
        default : null
    }
    

}, 
{
    timestamps  : true
})

userModel.methods.matchPassword = async function (enteredPassword){
console.log(enteredPassword);
  console.log(this.password);
  
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  console.log("Password match:", isMatch);
  console.log(isMatch);
  return isMatch;
}

userModel.pre("save", async function (next) {
    if(!this.isModified){
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model("User", userModel)
module.exports = User