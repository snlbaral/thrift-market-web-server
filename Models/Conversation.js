const mongoose = require('mongoose');

const convSchema = new mongoose.Schema({
    'sender_id': {type: mongoose.Schema.Types.ObjectId, required: true, ref:"user"},
    'receiver_id': {type: mongoose.Schema.Types.ObjectId, required: true, ref:"user"},
    'last_message': {type:String},
    'sender_id_unread_count': {type:Number, default: 0},
    'receiver_id_unread_count': {type:Number, default: 0}
}, {timestamps: true});

const Conversation = mongoose.model("conversation", convSchema);

module.exports = Conversation;
