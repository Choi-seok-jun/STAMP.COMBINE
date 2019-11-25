const express = require("express");
const router = express.Router();
const { User } = require("../model_app/user");
const { Personal } = require("../model_app/user");
const wrapper = require("../common_app/wrapper");

router.post(
  "/",
  wrapper(async (req, res, next) => {
    const inputId = req.body.id;
    const inputEmail = req.body.email;
    const withdrawalPersonal = await User.deleteOne({ id: inputId });
    const withdrawalUser = await Personal.deleteOne({ email: inputEmail });
    res.json({ result: true });
    next();
  })
);

module.exports = router;
