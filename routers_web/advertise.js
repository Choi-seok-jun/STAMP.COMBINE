const express = require("express");
const router = express.Router();
const { Advertise, validateAdver } = require("../models_web/advertise");
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
    advertise.views++;
    advertise.save();
    res.json({ advertises });
    next();
  })
);

module.exports = router;
