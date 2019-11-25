const express = require("express");
const router = express.Router();
const { User } = require("../model_app/user");
const { Personal } = require("../model_app/user");
const wrapper = require("../common_app/wrapper");

const auth = require("../common_app/auth")();

//내정보 조회  인증된 사용자만,,, auth.authenticate() 사용
router.post("/", auth.authenticate(), wrapper(async (req, res, next) => {

  console.log(req.user); // user 에 토큰이용 한 정보 담겨 있음
  // if (!req.user.admin) { // admin이 아닐때 접근 방지 하는 로직...
  //   res.json({ error: "unauthorized" });
  //   next();
  //   return;
  // }

  const inputEmail = req.body.email;
  const inputId = req.body.id;

  const personalRead = await Personal.find(
    { email: inputEmail },
    { _id: 0, email: 1, phone_num: 1, name: 1 }
  );
  const userRead = await User.find({ id: inputId }, { _id: 0, password: 1 });
  console.log(userRead);
  console.log(personalRead);
  res.json({ result: true });
  next();
}));

module.exports = router;
