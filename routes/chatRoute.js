const express = require("express")
const { createGroupController, autha } = require("../controllers/groupController")
const { protect } = require("../middlewares/authMiddleware")
const { previousChats, getChat, getUserToChat, getCurrentChat } = require("../controllers/chatController")

const Router = express.Router()

Router.post("/create-group", protect , createGroupController)
Router.post("/previous-chats", previousChats)
Router.post("/get-chat", getChat)
Router.post("/get-user-tochat", getUserToChat)
Router.post("/get-current-chat", getCurrentChat)



module.exports = Router