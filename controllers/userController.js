const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../helpers/generateTokens");
const User = require("../models/userMolel");

const loginController = expressAsyncHandler(async(req, res) => {
    const {username, password} = req.body;
    // console.log(req.body);
    if(!username || !password){
        res.status(200)
        throw new Error("Incomple info")
    } 
    const user = await User.findOne({username});
    // console.log(user);
    if(user && (await user.matchPassword(password))){ 
        const response = {
            _id : user._id,
            name : user.name,
            username : user.username,
            email : user.email,
            isAdmin : user.isAdmin,
            token : generateToken(user._id)
        }
        // console.log("user logedin",response);
        res.json(response)
    }else{
        res.status(400)
        throw new Error("invalid username or password")
    }


})
const singupController = expressAsyncHandler(async(req, res) => {
    // console.log(req.params);
    const {name, username, email, password} = req.body;
    // console.log(req.body);
    if(!name || !username || !email || !password){
        res.send(400)
        throw  new Error("Fill all the feilds")
    }
    const userExist = await User.findOne({email})
    if(userExist){
        throw new Error("User already exist")
    }
    const usernameExist = await User.findOne({username})
    if(usernameExist){
        throw new Error("username already taken")
    }

    const user  = await User.create({name,username, email, password})
    // console.log(user);
    if(user){
        res.status(200).json({
            _id: user._id,
            name : user.name,
            username : user.username,
            email : user.email,
            isAdmin : user.isAdmin,
            token : generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error("Singup faild")
    }
})

const fetchAllUsersController = expressAsyncHandler(async(req, res) => { 
  const users = await User.find({}).select('-password');
  res.send(users);
})

const getSideUsers = expressAsyncHandler(async(req, res) => {
    const {id} = req.body
    // console.log(id);
    const data = await User.findById(id).populate({path : "previousChats"});
    // console.log(data);
    res.send(data)
})

module.exports = {
    loginController,
    singupController,
    fetchAllUsersController,
    getSideUsers
}