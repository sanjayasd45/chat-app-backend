const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const msgModel = new Schema({
    
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    content: {
        type: String,
        required: true,
        trim:true
    },
    readBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    chatId: [{
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    }],

}, 
{
    timestamps  : true
}
)

const Msg = mongoose.model("Msg", msgModel)
module.exports = Msg