const express = require("express");
const router = express.Router();

let Board = require("../model/Board");
let User = require("../model/User");
const { createToken, verifyToken } = require("../utils/auth");

async function authenticate(req, res, next) {
  let token = req.cookies.authToken;
  let headerToken = req.headers.authorization;
  console.log(token);
  console.log(headerToken);
  if (!token && headerToken) {
    token = headerToken.split(" ")[1];
  }

  const user = verifyToken(token);
  req.user = user;

  if (!user) {
    const error = new Error("Authorization Failed");
    error.status = 400;

    next(error);
  }
  next();
}

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

router.get("/", function (req, res, next) {
  console.log("start populate");
  Board.find()
    .populate({ path: "author", select: "nickname" })
    .then((boards) => {
      res.json(boards);
    })
    .catch((err) => next(err));
});

//특정 id 보드 조회
router.get("/:boardId", authenticate, (req, res, next) => {
  Board.findById(req.params.boardId)
    .then((board) => {
      if (!req.session.pathTitle) {
        req.session.pathTitle = [];
      }
      req.session.pathTitle.push(board.title);
      // console.log(req.session);
      res.json(board);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/", authenticate, (req, res, next) => {
  Board.create({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author || "Anonymous",
  })
    .then((result) => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch((err) => {
      next(err);
    });
});
//삭제
router.delete("/:id", authenticate, function (req, res, next) {
  Board.findByIdAndDelete(req.params.id)
    .then((board) => {
      if (!board) {
        const error = new Error("Board not found");
        error.status = 404;
        throw error;
      }
      res.sendStatus(204);
    })
    .catch((err) => next(err));
});

//수정
router.put("/:id", authenticate, function (req, res, next) {
  //보드 id에 해당하는 내용을 수정해달라고 요청하기
  Board.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((board) => {
      if (!board) {
        const error = new Error("Board not found");
        error.status = 404;
        throw error;
      }
      res.json(board);
    })
    .catch((err) => next(err));
});

module.exports = router;
