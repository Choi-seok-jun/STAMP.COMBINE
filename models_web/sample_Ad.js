const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const sampleSchema = new Schema({
    author: { type: mongoose.Types.ObjectId, ref: "User_web" }, // 발행자
    authorName: String,
    title: String,          // 미션명
    discription: String,    // 요약
    attendWay: String,      // 참여방법
    attendNum: String,      // 참여인원
    reward: String,         // 보상
    startDate: Date,        // 시작 일, 시간
    endDate: Date,          // 마감 일, 시간
    tip: String,            // 팁 
    views: { type: Number, default: 0 },       // 조회수
    likedUser: [{ type: mongoose.Types.ObjectId, ref: "User" }],    //좋아요 여부
    coordinate: { latitud: { type: Number }, longitude: { type: Number } },
    address: { type: String },
    // url: String,
    // survey1: String,
    // survey2: String,
    // survey3: String,
    // imageUpLoad: String,
    // category: String,
    // ticket: Number,
});

const Sample = model("Sample", sampleSchema);

module.exports = { Sample };
