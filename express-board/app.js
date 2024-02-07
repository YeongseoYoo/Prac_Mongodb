var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const cors = require('cors');
const app = express();

// view engine setup


// session 미들웨어 설정
app.use(
  session({
    secret: process.env.SESSION_SECRET || "<my-secret>",
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false, // https만 가능하게 하는 옵션
    },
  })
);
// 세션 미들웨어를 사용하여 방문한 경로를 세션 배열에 추가
app.use((req, res, next) => {
  if (!req.session.path) {
    req.session.path = []; // Initialize the session path array if it doesn't exist
  }
  req.session.path.push(req.originalUrl); // Add the current request path to the session array
  console.log(req.originalUrl);
  console.log(req.session.path);
  next(); // Call next to move to the next middleware or route handler
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var birdsRouter = require('./routes/birds');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/birds', birdsRouter);

const boardRouter = require('./routes/board');
app.use('/board', boardRouter);   //나중에 내가 board 필요할 때 그대로 독립적으로 구현할 수 있게 만든 것임: 모듈화

const commentRouter = require('./routes/comments');
app.use('/comments', commentRouter); 



app.get('/sample', (req, res) => {
  res.send("Sample");
})
app.post('/sample', (req,res) => {
  res.send("Create First POST router");
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(res.locals);
});


module.exports = app;
