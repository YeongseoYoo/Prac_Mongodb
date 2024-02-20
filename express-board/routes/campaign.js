const express = require("express");
const router = express.Router();

let Campaign = require("../model/Campaign");

router.get("/", async (req, res, next) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
