const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const smtpPool = require("nodemailer-smtp-pool");
const { Personal } = require("../model_app/user");
const wrapper = require("../common_app/wrapper");
const password = process.env.EMAIL_PW || require("../mailConfig");

const { emailContents } = require("../model_app/emailHtml");

router.post(
  "/",
  wrapper(async (req, res, next) => {
    const inputEmail = req.body.email;
    const config = {
      mailer: {
        service: "Gmail",
        host: "STAMP.owner@gmail.com",
        user: "STAMP.owner",
        password
      }
    };
    const from = "STAMP < STAMP.owner@gmail.com >";
    const to = inputEmail;
    const subject = "STMAP 인증번호 안내입니다.";
    const authNo = Math.floor(Math.random() * 10 ** 15)
      .toString()
      .slice(0, 4);
    const html = emailContents(authNo);
    console.log(authNo);

    const mailOptions = {
      from,
      to,
      subject,
      html
    };

    const transporter = nodemailer.createTransport(
      smtpPool({
        service: config.mailer.service,
        host: config.mailer.host,
        port: config.mailer.port,
        auth: {
          user: config.mailer.user,
          pass: config.mailer.password
        },
        tls: {
          rejectUnauthorize: false
        },
        maxConnections: 5,
        maxMessages: 10
      })
    );
    // 메일을 전송하는 부분
    transporter.sendMail(mailOptions, async (err, res2) => {
      if (err) {
        console.log("failed... => ", err);
      } else {
        console.log("succeed... => ", res2);
        await Personal.updateOne(
          { email: inputEmail },
          { $set: { emailAuth: authNo } }
        );
        setTimeout(() => {
          User.updateOne({ email: inputEmail }, { $set: { emailAuth: "" } });
        }, 300000);

        res.json({ result: true });
        next();
      }

      transporter.close();
    });
  })
);
router.post(
  "/emailCheck",
  wrapper(async (req, res, next) => {
    const { email, inputAuthNo } = req.body;
    const rs = await Personal.findOne(
      {
        email: email
      },
      { emailAuth: 1 }
    );
    if (rs.emailAuth === inputAuthNo) {
      const rs2 = await Personal.updateOne(
        { email },
        { $set: { emailCheck: true } }
      );
      if (rs2) {
        res.json({ result: true });
      } else {
        res.json({ result: false });
      }
    } else {
      res.json({ result: false });
    }
    next();
  })
);

router.post(
  "/emailCheck",
  wrapper(async (req, res, next) => {
    const { email, inputAuthNo } = req.body;
    const rs = await Personal.findOne(
      {
        email: email
      },
      { emailAuth: 1 }
    );
    if (rs.emailAuth === inputAuthNo) {
      const rs2 = await Personal.updateOne(
        { email },
        { $set: { emailCheck: true } }
      );
      if (rs2) {
        res.json({ result: true });
      } else {
        res.json({ result: false });
      }
    } else {
      res.json({ result: false });
    }
    next();
  })
);

module.exports = router;
