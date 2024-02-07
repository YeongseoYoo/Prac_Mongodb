const mongoose = require("mongoose");
const MONGO_HOST = "mongodb+srv://admin:admin1234@yscluster.y1tyjoy.mongodb.net/user";
//?retryWrites=true&w=majority
mongoose.connect(MONGO_HOST,{
    retryWrites: true,
    w: 'majority',
}).then(resp=>{
    // console.log(resp);
    console.log("userDB 연결 성공");
});



const moongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email: {
        type : String,
        required: [true, "이메일을 입력해 주세요."],
        unique: true,
        lowercase: true,
        validate: [isEmail, "올바른 이메일 형식이 아닙니다."],
    },
    password: {
        type: String,
        required: [true, "비밀번호가 입력되어야 합니다."],
    },
});
//statics: mongoose에 지원하는 
userSchema.statics.signUp = async function (email, password){
    const salt = await bcrypt.genSalt();
    console.log(salt);
    try{ //단방향 hashing 알고리즘으로는 bcrypt, SHA 등이 있음.
        const hashedPassword = await bcrypt. hash(password, salt);
        const user = await this.create({ email, password:
        hashedPassword });
        return {
            _id : user._id,
            email: user.email,
        };
    }catch (err) {
        throw err;
    }
};

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password,
            user.password);
            if (auth) {
                return user.visibleUser;
            }
            throw Error("incorrect password");
        }
        throw Error("incorrect email");
    };

const visibleUser = userSchema.virtual("visibleUser");
visibleUser.get(function (value, virtual, doc) {
    return {
        _id: doc._id,
        email: doc.email,
    };
});

const User = mongoose.model("user", userSchema);

module.exports = User;