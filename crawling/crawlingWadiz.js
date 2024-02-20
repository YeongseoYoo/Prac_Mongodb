const axios = require("axios");
const fs = require("fs/promises");
const Campaign = require("../express-board/model/Campaign.js"); // Assuming Campaign is exported as default from Campaign.js
const mongoose = require("mongoose");

async function fetchFunding() {
  try {
    const productList = [];
    const baseUrl = `https://service.wadiz.kr/api/search/funding`;
    const response = await axios.post(baseUrl, {
      startNum: 0,
      order: "recommend",
      limit: 50, //데이터 값. 1000개는 됨. 요청 10번이면 가능. but 10,000번이라는 큰 수를 넣으면 주지 않는다.
      categoryCode: "",
      endYn: "",
    });

    const data = response.data;
    const fundings = data.data.list;

    fundings.forEach((funding) => {
      const campaignId = funding.campaignId;
      const categoryName = funding.categoryName;
      const title = funding.title;
      const totalBackedAmount = funding.totalBackedAmount;
      const photoUrl = funding.photoUrl;
      const nickName = funding.nickName;
      const coreMessage = funding.coreMessage;
      const whenOpen = funding.whenOpen;
      const achievementRate = funding.achievementRate;

      productList.push({
        categoryName,
        campaignId,
        title,
        totalBackedAmount,
        photoUrl,
        nickName,
        coreMessage,
        whenOpen,
        achievementRate,
      });
    });

    console.log(productList);

    // Save data to JSON file
    await fs.writeFile(
      "fetched_Data.json",
      JSON.stringify(productList, null, 2)
    );
    console.log("Data saved to JSON file.");

    // Save data to MongoDB
    await Campaign.insertMany(productList); // Assuming Campaign is a Mongoose model
    console.log("Data saved to MongoDB.");

    return productList;
  } catch (error) {
    console.error("Error fetching funding:", error);
    return [];
  }
}

// Connect to MongoDB with connectTimeoutMS option
mongoose
  .connect("mongodb+srv://admin:admin1234@yscluster.y1tyjoy.mongodb.net", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000, // 연결 시간 초과 설정 추가
  })
  .then(() => {
    console.log("Connected to MongoDB.");
    // Call fetchFunding function
    fetchFunding();
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
