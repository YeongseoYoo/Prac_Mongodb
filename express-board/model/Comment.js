const mongoose = require("mongoose");


const commentSchema = new mongoose.Schema ({
    id: { type: mongoose.Types.ObjectId, ref:'Board'},
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});


const Comment = mongoose.model("Comment", commentSchema); //모델 생성

module.exports = Comment;