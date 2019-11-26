const express = require("express");
const router = express.Router();
const { Advertise, validateAdver } = require("../models_web/advertise");
const { User_web } = require("../models_web/web_user");
const { User, validateUser } = require("../model_app/user");
const { Sample } = require("../models_web/sample_Ad");
const wrapper = require("../common_web/wrapper");

// 모든 미션 정보 조회 후 front에 전달
router.get("/all", wrapper(async (req, res, next) => {

    const allSample = await Sample.find();
    res.json({ result: true, DBdata: allSample });
    next();
}));

// 샘플 미션 등록
router.post("/upload", wrapper(async (req, res, next) => {
    const {
        web_userId,     // 미션 발행자 실제 id
        // author, // 미션 발행자 db주소
        title,
        discription,
        attendWay,
        attendNum,
        reward,
        startDate,
        endDate,
        tip,
    } = req.body;

    // 작성자 검색
    const theAuthor = await User_web.find({ id: web_userId });

    const new_sample = new Sample({
        author: theAuthor._id,
        title,
        discription,
        attendWay,
        attendNum,
        reward,
        startDate,
        endDate,
        tip,
    });
    const saveResult = await new_sample.save(); // db에 저장
    console.log(saveResult);
    res.json({ result: true });
    next();
}));

// 해당 미션 좋아요
router.post("/like", wrapper(async (req, res, next) => {
    console.log(req.body);

    const { 광고주소, 접속한사람주소 } = req.body;

    //1. 광고주소에서 접속한사람의 주소가 있으면, 좋아요 취소
    //2. 없으면, 좋아요 추가

    const theAd = await Sample.findById(광고주소);
    const theUser = await User.findById(접속한사람주소);

    const islikeUser = theAd.likedUser.find(el => el == 접속한사람주소);
    if (islikeUser) {
        // 접속한사람을 삭제해
        await Sample.updateOne({ _id: 광고주소 }, { $pull: { likedUser: islikeUser } });
        await User.updateOne({ _id: 접속한사람주소 }, { $pull: { like: 광고주소 } });
        res.json({ result: "좋아요 취소" });
    } else {
        theAd.likedUser.push(접속한사람주소);
        theUser.like.push(광고주소);
        await theAd.save();
        await theUser.save();
        res.json({ result: "좋아요 등록" });
    }
    next();
}));



module.exports = router;
