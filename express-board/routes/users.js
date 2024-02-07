var express = require('express');
var router = express.Router();

let User = require("../model/User");

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post("/signup", async(req, res, next)=> {
  try{
    const {email, password} = req.body;
    console.log(req.body);
    const user = await User.signUp(email, password);
    res.status(201).json(user);
  }catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

router.post("/login", async(req, res, next) => {
  try {
    const { email, password} = req.body;
    const user= await User.login(email, password);
    const tokenMaxAge = 60 * 60 * 24 * 3;
    // const token = createToken(user, tokenMaxAge);

    // user.token = token;

    // res.cookie("authToken", token, {
    //   httpOnly: true,
    //   maxAge : tokenMaxAge * 1000,
    // });
    // console.log(user);
    res.status(201).json(user);
  }catch (err) {
    console.error(err);
    res.status(400);
    next(arr);
  }
});

// router.all("/logout", async (req, res, next) => {
//   try{
//     const { email, password } = req.body;
//     const user = await User.login(email, password);
//     const tokenMaxAge = 60 * 60 * 24 * 3;
//     // const token = createToken(user, tokenMaxAge);
//   }
// });

module.exports = router;
