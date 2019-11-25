const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User_web, validateUser } = require("../models_web/web_user");
const { jwtSecret } = require("../common_web/jwt_config");
const wrapper = require("../common_web/wrapper");

// 회원보기
router.get(
  "/user_check",
  wrapper(async (req, res, next) => {
    const id = req.query.id;
    const user = await User_web.findOne({ id });
    if (user) {
      res.json({ result: false });
    } else {
      res.json({ result: true });
    }
    next();
  })
);

// 체크
router.get(
  "/check",
  wrapper(async (req, res, next) => {
    const users = await User_web.find();
    res.json({ users });
    next();
  })
);

// 회원가입
router.post(
  "/join",
  wrapper(async (req, res, next) => {
    const {
      id,
      password,
      name,
      company_no,
      company_name,
      company_location,
      phonenumber,
      ticket
    } = req.body;
    if (validateUser(req.body).error) {
      // 검증과정 통과 못하면
      res.status(400).json({ result: false });
      next();
      return;
    }
    const saltRound = 10;
    const hashedPW = await bcrypt.hash(password, saltRound);
    const user = new User_web({
      id,
      password: hashedPW,
      name,
      company_no,
      company_name,
      company_location,
      phonenumber,
      ticket
    });
    const saveResult = await user.save(); // db에 저장
    res.json({ result: true });
    next();
  })
);

// 로그인
router.post(
  "/login",
  wrapper(async (req, res, next) => {
    const {
      id,
      password,
      ticket,
      name,
      company_no,
      company_name,
      company_location,
      phonenumber
    } = req.body;
    const user = await User_web.findOne({ id: id });
    if (!user) {
      res.json({ result: false });
      next();
      return;
    }
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      // 토큰을 만들어 줍시다!
      const token = jwt.sign(
        {
          id: user._id,
          password: user.password,
          name: user.name,
          company_no: user.company_no,
          company_name: user.company_name,
          company_location: user.company_location,
          phonenumber: user.phonenumber,
          ticket: user.ticket
        },
        jwtSecret,
        { expiresIn: "1h" }
      );
      res.json({
        result: true,
        token,
        id,
        password,
        name,
        company_no,
        company_name,
        company_location,
        phonenumber,
        ticket
        // admin: user.admin
      });
      next();
    } else {
      res.json({ result: false });
      next();
    }
  })
);

module.exports = router;
