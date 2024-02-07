// const mongoose = require("mongoose");
// const MONGO_HOST = "mongodb+srv://admin:admin1234@yscluster.y1tyjoy.mongodb.net/boards";
// //?retryWrites=true&w=majority
// mongoose.connect(MONGO_HOST,{
//     retryWrites: true,
//     w: 'majority',
// }).then(resp=>{
//     // console.log(resp);
//     console.log("DB 연결 성공2");
// });

// const commentSchema = new mongoose.Schema ({
//     id: { type: mongoose.Types.ObjectId, ref:'Board'},
//     title: { type: String, required: true },
//     content: { type: String, required: true },
//     author: String,
//     createdAt: { type: Date, default: Date.now }
// });


// const Comment = mongoose.model("Comment", commentSchema); //모델 생성

// module.exports = Comment;