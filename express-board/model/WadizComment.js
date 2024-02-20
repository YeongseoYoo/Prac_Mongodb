const mongoose = require("mongoose");

const wcommentSchema = new mongoose.Schema({
  body: { type: String, required: true },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
  },
  commentType: String,
  nickName: { type: String, required: true },
  whenCreated: Date,
  commentReplys: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WadizComment",
    },
  ],
  depth: { type: Number,required: true },
  // Add field for storing replies to this comment
});

const WadizComment = mongoose.model("WadizComment", wcommentSchema);

module.exports = WadizComment;
