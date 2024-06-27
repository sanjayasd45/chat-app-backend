const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userMolel");
const Msg = require("../models/msgModel");
const Chat = require("../models/chatModel");
const { default: mongoose } = require("mongoose");

const previousChats = expressAsyncHandler(async(req, res) => {
    const {senderId, receiverId} = req.body
    const prevChat = await User.findById(senderId)
    if(!prevChat.previousChats.includes(receiverId)){
        prevChat.previousChats.push(receiverId)
        await prevChat.save()
    }
    res.send(prevChat)
})
const getChat = expressAsyncHandler(async(req, res) => {
  const { senderId, receiverId } = req.body;

  let chat = await Chat.findOne({
    members: { $all: [senderId, receiverId] }
  });

  if (chat?.members) {
      console.log(chat);
      res.json({chat});
  } else {
      chat = new Chat({
          members: [senderId, receiverId]
      });
      await chat.save();
      console.log("new chat created with two id's > ",senderId, " > ", receiverId);
      res.json(chat);
  }
})
const getUserToChat = expressAsyncHandler (async(req, res) => {
  const {receiverId} = req.body
  const userData = await User.findById(receiverId).select("-password")
  res.json({userData})
})

const getCurrentChat = expressAsyncHandler(async(req, res) => {
  const { senderId, receiverId } = req.body;

  let chat = await Chat.findOne({
    members: { $all: [senderId, receiverId] }
  }).populate("chatMsg");
  res.json({chat})
})

module.exports = {
    previousChats,
    getChat,
    getUserToChat,
    getCurrentChat
}