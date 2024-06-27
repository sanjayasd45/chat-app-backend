const express = require('express');
const { default: mongoose } = require('mongoose');
const cors = require("cors")
require("dotenv").config()
const password = encodeURIComponent(process.env.PASSWORD)
const port = process.env.PORT || 3000
const {createServer} = require('node:http')
const {Server} = require("socket.io")

const Msg = require("./models/msgModel")

const userRoutes = require("./routes/userRoute")
const chatRoutes = require("./routes/chatRoute");
const User = require('./models/userMolel');
const Chat = require('./models/chatModel');


const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins (you can specify a specific domain here)
        methods: ["GET", "POST"], // Allowed HTTP methods
        allowedHeaders: ["my-custom-header"], // Custom headers you might use
        credentials: true // Allow credentials like cookies
      }
})
app.use(express.json())
app.use(cors())

mongoose.connect(`mongodb+srv://sanjayasd45:${password}@datacluster.lgoji1f.mongodb.net/chat-app?retryWrites=true&w=majority`)
    .then(() => {
        server.listen(port, () => console.log("db connected, server is running at port : ", port))
    })

io.on('connection', (socket) => {
    console.log('New client connected', socket.id);
    socket.on('set-socket-id', async (data) => {
        console.log(data);
        try {
            if (!data.senderId) {
                console.error('No senderId provided');
                return;
            }

            const userData = await User.findById(data.senderId);

            if (!userData) {
                console.error(`User with id ${data.senderId} not found`);
                return;
            }

            userData.socketId = socket.id;
            console.log(userData);
            await userData.save();
    
            console.log(`Socket ID ${socket.id} set for user ${data.senderId}`);
        } catch (error) {
            console.error('Error setting socket ID:', error);
        }
    });


    // Join a chat
    socket.on('joinChat', ({ userId, chatId }) => {
        socket.join(chatId);
        console.log(`${userId} joined chat ${chatId}`);
    });

    // Listen for chat messages
    socket.on('chatMessage', async ({ chatId, senderId, receiverId, message }) => {
        const newMessage = new Msg({
            sender: senderId,
            receiver: receiverId,
            content: message,
            chat: chatId
        });

        await newMessage.save();

        // Emit message to the chat room
        io.to(receiverId).emit('message', message);
    });
    socket.on("msg", async (data) => {
        try {
            const { senderId, receiverId, message } = data;

            let chat = await Chat.findOne({
                members: { $all: [senderId, receiverId] }
            });
            const receiver = await User.findById(receiverId)
    
            if (!chat) {
                chat = new Chat({
                    members: [senderId, receiverId],
                    chatMsg: [] 
                });
            }
    
            const msg = new Msg({
                senderId,
                receiverId,
                content: message,
                chatId: chat._id
            });
    
            await msg.save();
    
            chat.chatMsg.push(msg);
    
            await chat.save();
    
            io.to(receiver.socketId).emit('message', data);
        } catch (error) {
            console.error("Error handling message:", error);
        }
    });
    

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


app.get('/', (req, res) => {
    res.send("get it...")
})
app.use("/user", userRoutes)
app.use("/chat", chatRoutes)