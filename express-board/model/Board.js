// const mongoose = require("mongoose");
// const MONGO_HOST = "mongodb+srv://admin:admin1234@yscluster.y1tyjoy.mongodb.net/boards";
// //?retryWrites=true&w=majority
// mongoose.connect(MONGO_HOST,{
//     retryWrites: true,
//     w: 'majority',
// }).then(resp=>{
//     // console.log(resp);
//     console.log("DB 연결 성공");
// });


// const boardSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     content: { type: String, required: true },
//     author: String,
//     createdAt: { type: Date, default: Date.now }   
// });


// const Board = mongoose.model("Board", boardSchema); //모델 생성

// module.exports = Board;