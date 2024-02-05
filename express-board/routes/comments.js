const express = require('express');
const router = express.Router();

const Comment = require("../model/Comment");

//comment 조회
router.get("/", function(req, res, next) {
    Comment.find()
    .then(boards => res.json(boards))
    .catch(err=> next(err))
});

router.post("/", (req, res, next)=>{
    console.log(req.body);
    const { id, title, content, author } = req.body; // Assuming id is provided in the request body
    Comment.create({
        id: id, // Assign provided id to the id field
        title: title,
        content: content,
        author: author || 'Anonymous'
    }).then(result=>{
        console.log(result)
        res.status(201).json(result);
    }).catch(err=>{
        next(err)
    })
})

//삭제
router.delete("/:id", function(req, res, next) {
    Comment.findByIdAndDelete(req.params.id)
        .then(board => {
            if (!board) {
                const error = new Error('Board not found');
                error.status = 404;
                throw error;
            }
            res.sendStatus(204);
        })
        .catch(err => next(err));
});

//수정
router.put("/:id", function(req, res, next) {       //보드 id에 해당하는 내용을 수정해달라고 요청하기
    Comment.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(board => {
            if (!board) {
                const error = new Error('Board not found');
                error.status = 404;
                throw error;
            }
            res.json(board);
        })
        .catch(err => next(err));
});

// router.get("/:id/comments", function(req, res, next) {
//     const boardId = req.params.id;
//     Board.findById(boardId)
//     .then(board => {
//         res.json(board.comments);
//     })
//     .catch(err => next(err));
// });

// router.post('/:id/comments', async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const { title, author, content } = req.body;
//         // Find the board by ID and add the comment
//         const updatedBoard = await Board.findByIdAndUpdate(
//             id,
//             { $push: { comments: { title, author, content, createdAt: new Date() } } },
//             { new: true }
//         );
//         res.json(updatedBoard.comments); // Return only the updated comments array
//     } catch (err) {
//         next(err);
//     }
// });


module.exports = router;