const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User, validateUser } = require("../model_app/user");
const { Personal, validatePersonal } = require("../model_app/user");
const { jwtSecret } = require("../common_app/jwt_config");
const wrapper = require("../common_app/wrapper");

// post : 회원가입
router.post("/join", wrapper(async (req, res, next) => {
  const { name, email, phone_num, id, password } = req.body;

  if (validatePersonal({ name, email, phone_num }).error) {    //검증과정 통과 못하면
    res.status(400).json({ result: false });
    next();
    return;
  }
  if (validateUser({ password, id }).error) {    //검증과정 통과 못하면
    res.status(400).json({ result: false });
    next();
    return;
  }

  // 비번 hash 
  const saltRound = 10;
  const hashedPW = await bcrypt.hash(password, saltRound);

  // 새로운 [개인정보] 생성 및 DB에 저장
  User.aggregate
  const new_personal = new Personal({ name, email, phone_num });
  await new_personal.save();

  // 새로운 [계정정보] 생성 및 DB에 저장
  const new_user = new User({ password: hashedPW, id, persAdd: new_personal._id });
  await new_user.save();

  // 새로운 [계정정보]의 _id를 [개인정보에 연결]
  await Personal.updateOne(
    { _id: new_personal._id },            // 검색 조건
    { $set: { userAdd: new_user._id } }   // 업데이트 내용
  );

  res.json({ result: true, msg: "회원가입 완료" });
  next();
}));

// post : 로그인
router.post("/login", wrapper(async (req, res, next) => {
  // 사용자 입력값
  const { id, password } = req.body;
  // const user_input_id =req.body.id;

  // DB 조회
  const user = await User.findOne({ id });
  // DB 조회 결과가 없으면, 더 진행하지 않고 next()호출 후, return으로 이 router를 벗어남.
  console.log(user);
  if (!user) {
    res.json({ result: false, msg: "ID 없음" });
    next();
    return;
  }

  // DB 조회 결과가 있으면, 비번 비교 후 token 발행
  const userInputPassword = req.body.password;
  const dbPassword = user.password;
  const comparePassword = await bcrypt.compare(userInputPassword, dbPassword);

  if (comparePassword) {   // 비밀번호가 맞는경우 토큰을 만들어줌!
    const token = jwt.sign(
      { userAdd: user._id },   // 토큰 주요 내용
      jwtSecret,          // 암호문
      { expiresIn: "10m" } // 유효기간
    );

    res.json({ result: true, msg: "로그인 되었습니다.", token }); // front로 token전달
    next();

  } else { // 비밀번호가 다를 경우
    res.json({ result: false, msg: "비밀번호가 맞지않습니다." });
    next();
  }
}));

// get : id 중복검사
router.get("/id", wrapper(async (req, res, next) => {
  const id = req.query.id;
  if (!id) { // 입력값이 없을 때, 중복검사 결과가 null 이므로, 사용가능이 되는 것을 방지
    res.json({ error: "Auth", msg: "잘못된 접근입니다." });
    next();
    return;
  }
  const db_result = await User.findOne({ id });
  if (db_result) { // db조회 결과가 있으면 = 이미 있다는 뜻
    res.json({ result: false, msg: "중복" });
  } else {
    res.json({ result: true, msg: "사용가능" });
  }

  next();
}));
// get : phone_num 중복검사
router.get("/phone_num", wrapper(async (req, res, next) => {
  const phone_num = req.query.phone_num;
  if (!phone_num) { // 입력값이 없을 때, 중복검사 결과가 null 이므로, 사용가능이 되는 것을 방지
    res.json({ error: "Auth", msg: "잘못된 접근입니다." });
    next();
    return;
  }
  const db_result = await Personal.findOne({ phone_num });
  if (db_result) { // db조회 결과가 있으면 = 이미 있다는 뜻
    res.json({ result: false, msg: "중복" });
  } else {
    res.json({ result: true, msg: "사용가능" });
  }
  next();
}));
// get : email 중복검사
router.get("/email", wrapper(async (req, res, next) => {
  const email = req.query.email;
  if (!email) { // 입력값이 없을 때, 중복검사 결과가 null 이므로, 사용가능이 되는 것을 방지
    res.json({ error: "Auth", msg: "잘못된 접근입니다." });
    next();
    return;
  }
  const db_result = await Personal.findOne({ email });
  if (db_result) { // db조회 결과가 있으면 = 이미 있다는 뜻
    res.json({ result: false, msg: "중복" });
  } else {
    res.json({ result: true, msg: "사용가능" });
  }
  next();
}));

module.exports = router;
