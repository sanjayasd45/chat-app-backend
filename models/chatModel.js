const mongoose = require("mongoose")

const ChatModel = mongoose.Schema({
    members: [{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    isGroupChat: {
        type: Boolean,
        default: false
    },
    groupName: {
        type: String,
        trim: true
    },
    groupPicture: {
        type: String,
        default: ''
    },
    chatMsg: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Msg'
    }]

}
, 
{
    timestamps : true
}
)

const Chat = mongoose.model("Chat", ChatModel)
module.exports = Chat