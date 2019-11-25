const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../model_app/user");
const { Personal } = require("../model_app/user");
const wrapper = require("../common_app/wrapper");

router.post(
  "/passwordChange",
  wrapper(async (req, res, next) => {
    const inputId = req.body.id;
    const inputPasword = req.body.password;
    const saltRound = 10;
    const hashedPW = await bcrypt.hash(inputPasword, saltRound);
    const passwordChange = await User.updateOne(
      { id: inputId },
      { $set: { password: hashedPW } }
    );
    res.json({ result: true });
    next();
  })
);
router.post(
  "/phone_numChange",
  wrapper(async (req, res, next) => {
    const inputEmail = req.body.email;
    const inputphone_num = req.body.phone_num;
    const phone_numChange = await Personal.updateOne(
      { email: inputEmail },
      { $set: { phone_num: inputphone_num } }
    );
    res.json({ result: true });
    next();
  })
);
module.exports = router;
