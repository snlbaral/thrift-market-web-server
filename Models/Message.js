const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    'sender_id': {type: mongoose.Schema.Types.ObjectId, required: true},
    'receiver_id': {type: mongoose.Schema.Types.ObjectId, required: true},
    'fromMe': {type: Boolean, required: true},
    'media': {type: String},
    'mediaType': {type: String},
    'message': {type:String, required: true},
    'seen': {type:Boolean, default: false},
    'conversation_id': {type: mongoose.Schema.Types.ObjectId, required: true},
}, {timestamps: true});

const Message = mongoose.model('message', messageSchema);

module.exports = Message;