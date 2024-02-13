const mongoose = require("mongoose");
const User = require("./User"); // User 모델을 불러옵니다.

const boardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // User 모델을 참조합니다.
        required: true
    },
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date, default: Date.now }
});

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
