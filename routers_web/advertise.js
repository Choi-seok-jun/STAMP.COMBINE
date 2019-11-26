const express = require("express");
const router = express.Router();
const { Advertise, validateAdver } = require("../models_web/advertise");
const { User, validateUser } = require("../model_app/user");
const wrapper = require("../common_web/wrapper");

router.get(
  "/",
  wrapper(async (req, res, next) => {
    const { page = "1" } = req.query;
    const skip = parseInt(page) * 5 - 5;
    {
      const advertises = await Advertise.find()
        .limit(5)
        .skip(skip)
        // .sort("-date")
        .populate("name");
      res.json({ advertises });
    }
    const advertises = {},
      update = { $inc: { views: 1 } };
    next();
  })
);

// 광고등록
router.post(
  "/mission",
  wrapper(async (req, res, next) => {
    const {
      id,
      title,
      missionUser,
      num,
      content,
      url,
      startDate,
      endDate,
      survey1,
      survey2,
      survey3,
      imageUpLoad,
      category,
      ticket
    } = req.body;
    if (validateAdver(req.body).error) {
      // 검증과정 통과 못하면
      res.status(400).json({ result: false });
      next();
      return;
    }
    const advertise = new Advertise({
      id,
      title,
      missionUser,
      num,
      content,
      url,
      startDate,
      endDate,
      survey1,
      survey2,
      survey3,
      imageUpLoad,
      category,
      ticket
    });
    const saveResult = await advertise.save(); // db에 저장
    res.json({ result: true });
    next();
  })
);
// 광고보기
router.get(
  "/mission_check",
  wrapper(async (req, res, next) => {
    const advertises = await Advertise.find();
    res.json({ advertises });
    next();
  })
);

// 해당 광고 좋아요
router.post("/like", wrapper(async (req, res, next) => {
  console.log(req.body);
  const { 광고주소, 접속한사람주소 } = req.body;

  //1. 광고주소에서 접속한사람의 주소가 있으면, 좋아요 취소
  //2. 없으면, 좋아요 추가

  const theAd = await Advertise.findById(광고주소);
  const theUser = await User.findById(접속한사람주소);

  const islikeUser = theAd.likedUser.find(el => el == 접속한사람주소);
  if (islikeUser) {
    // 접속한사람을 삭제해
    await Advertise.updateOne({ _id: 광고주소 }, { $pull: { likedUser: islikeUser } });
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
