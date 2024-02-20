const mongoose = require("mongoose");
const axios = require("axios");
const fs = require("fs/promises");
const Campaign = require("./model/Campaign");
const WadizComment = require("./model/WadizComment");

async function fetchFunding(campaignId) {
  try {
    const commentList = [];
    const baseUrl = `https://www.wadiz.kr/web/reward/api/comments/campaigns/${campaignId}`;
    const params = {
      page: 0,
      size: 20,
      commentGroupType: "CAMPAIGN",
      rewardCommentType: "",
    };
    const response = await axios.get(baseUrl, { params });

    const data = response.data;
    const comments = data.data.content;

    // Get the ObjectId of the campaign
    const campaign = await Campaign.findOne({ campaignId });

    // Save all comments including replies
    for (const comment of comments) {
      await saveComment(comment, campaign._id, commentList);
    }

    return commentList;
  } catch (error) {
    console.error("Error fetching funding:", error);
    return [];
  }
}

async function saveComment(comment, campaignId, commentList) {
  const { body, commentType, nickName, whenCreated, commentReplys, depth } =
    comment;

  const formattedReplies = [];

  // Save comment replies
  for (const reply of commentReplys) {
    const newReply = await saveComment(reply, campaignId, commentList);
    formattedReplies.push(newReply._id);
  }

  // Save the comment with proper campaignId and formatted replies
  const newComment = await WadizComment.create({
    body,
    campaignId,
    commentType,
    nickName,
    whenCreated,
    commentReplys: formattedReplies, // Save reply IDs
    depth,
  });

  commentList.push(newComment);

  return newComment;
}

async function fetchAndSaveAllFundingComments() {
  try {
    const allCommentList = [];

    // Connect to MongoDB
    await mongoose.connect(
      "mongodb+srv://admin:admin1234@yscluster.y1tyjoy.mongodb.net",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB.");

    // Campaign 모델 정의
    const CampaignModel = mongoose.model("Campaign");

    // 모든 캠페인 가져오기
    const campaigns = await CampaignModel.find();

    // 각 캠페인에 대한 댓글 가져오기
    for (const campaign of campaigns) {
      const campaignId = campaign.campaignId;
      console.log(`Fetching comments for campaign: ${campaignId}`);
      const commentList = await fetchFunding(campaignId);
      allCommentList.push(...commentList);
    }

    // Save all comments to JSON file
    await fs.writeFile(
      "fetched_Comment.json",
      JSON.stringify(allCommentList, null, 2)
    );
    console.log("Data saved to JSON file.");

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");

    return allCommentList;
  } catch (error) {
    console.error("Error fetching and saving funding comments:", error);
    return [];
  }
}

// Fetch and save all funding comments
fetchAndSaveAllFundingComments();
