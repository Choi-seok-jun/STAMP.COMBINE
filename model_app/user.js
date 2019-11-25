const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const { Schema, model } = mongoose;

/**
 * 1. Schema로 구조 만든다
 * 2. model로 collection의 document 접근 방법 설정
 * 3. @hapi/joi 모듈을 이용해 입력값 검증을 한다
 */

const personalSchema = new Schema({
  // 입력값
  name: String,
  email: { type: String, unique: true },
  phone_num: { type: String, unique: true },
  // 나중에 채워지는 값
  admin: { type: Boolean, default: false },
  userAdd: { type: mongoose.Types.ObjectId, ref: "User" },
  emailAuth: { type: String, default: "" },
  emailCheck: { type: Boolean, default: false }
});

const Personal = model("Personal", personalSchema);

function validatePersonal(personal) {
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone_num: Joi.string(),
    admin: Joi.boolean(),
    userAdd: Joi.string(),
    emailAuth: Joi.string(),
    emailCheck: Joi.string()
  });
  return schema.validate(personal);
}

const userSchema = new Schema({
  id: { type: String, unique: true },
  password: String,
  persAdd: { type: mongoose.Types.ObjectId, ref: "Personal" }
});

const User = model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    id: Joi.string(),
    password: Joi.string(),
    persAdd: Joi.string()
  });
  return schema.validate(user);
}

module.exports = {
  User,
  Personal,
  validateUser,
  validatePersonal
};
