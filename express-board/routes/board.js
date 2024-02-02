const express = require('express');
const router = express.Router();

let Board = require("../model/Board");

/*
    + /board GET - 게시글 리스트 조회.
    + /board POST - 게시글 자원을 생성해 줘
    + /board/:boardId GET - 게시글 자원 중에 boardId 자원을 가져와줘
    + /board/:boardId PUT - 게시글 자원 중 boardId 자원을 수정해줘.
    + /board/:boardId DELETE - 게시글 자원 중 boardId 자원을 삭제해줘.

    + /board/:boardId/comments GET - 게시글 자원 중 boardId에 해당하는 게시글의 댓글 리스트를 가져와줘

    원래는 PUT, DELETE 안 쓰고 GET, POST로 기능을 다 구현할 수도 있다. 
*/

//모든 보드 조회
router.get("/", function(req, res, next) {
    Board.find()
    .then(boards => res.json(boards))
    .catch(err=> next(err))
});
//특정 id 보드 조회
router.get("/:id", function(req, res, next) {
    Board.findById(req.params.id)
        .then(boards => {
            if (!boards) {
                const error = new Error('Board not found');
                error.status = 404;
                throw error;
            }
            res.json(boards);
        })
        .catch(err => next(err));
});

// router.get('/', async (req, res, next) => {
//     try {
//         const boards = await Board.create(req.body);
//         res.send(board);
//     } catch (err) {
//         next(err);
//     }
// });
//추가
router.post("/", function(req,res,next){
    console.log(req.body);
    Board.create(req.body)
    .then(boards => res.json(boards))
    .catch(err=> next(err))
});
//삭제
router.delete("/:id", function(req, res, next) {
    Board.findByIdAndDelete(req.params.id)
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
router.put("/:id", function(req, res, next) {
    Board.findByIdAndUpdate(req.params.id, req.body, { new: true })
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


module.exports = router;