const express = require("express");
const router = express.Router();
const Campaign = require("../model/Campaign.js");
const WadizComment = require("../model/WadizComment.js");

// Get all campaigns
router.get("/campaign", async (req, res, next) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (error) {
    next(error);
  }
});

// Get campaign by ID with comments
router.get("/:campaignId", async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.campaignId);
    const comments = await WadizComment.find({
      campaignId: req.params.campaignId,
    });
    res.json({ campaign, comments });
  } catch (error) {
    next(error);
  }
});

// Add a new comment to a campaign
router.post("/:campaignId/comment", async (req, res, next) => {
  try {
    const { body, nickName, depth } = req.body;
    const newComment = new WadizComment({
      body,
      nickName,
      depth,
      campaignId: req.params.campaignId,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
});

// Add a new reply to a comment
router.post("/:campaignId/comment/:commentId", async (req, res, next) => {
  try {
    const { body, nickName, depth } = req.body;
    const newReply = new WadizComment({
      body,
      nickName,
      depth,
      campaignId: req.params.campaignId,
      parentId: req.params.commentId,
    });
    await newReply.save();

    // 댓글에 대한 대댓글 ObjectId를 댓글의 commentReplys 배열에 추가
    const parentComment = await WadizComment.findById(req.params.commentId);
    parentComment.commentReplys.push(newReply._id);
    await parentComment.save();

    res.status(201).json(newReply);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
