const express = require("express");
const mongoose = require("mongoose");
const Helmet = require("helmet");
const app = express();
const user = require("./router_app/user");
const read = require("./router_app/read");
const modify = require("./router_app/modify");
const config = require("./common_app/jwt_config");
const auth = require("./common_app/auth")();
const web_auth = require("./common_web/web_auth")();
const emailAuth = require("./router_app/emailAuth");
const withdraw = require("./router_app/withdraw");
const web_user = require("./routers_web/web_user");
const advertise = require("./routers_web/advertise");

const dbURI = process.env.MONGODB_URI || " mongodb://localhost/stamp-run";

app.use(Helmet());
app.use((req, res, next) => {
  mongoose
    .connect(dbURI, {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: true
    })
    .then(() => next())
    .catch(e => next(e));
});
app.use(auth.initiallze());
app.use(web_auth.initialize());
app.use(express.json());
app.use("/auth", user);
app.use("/web_auth", web_user);
app.use("/stamp", web_user);
app.use("/advertise", advertise);
app.use("/auth/read", read);
app.use("/auth/modify", modify);
app.use("/auth/emailAuth", emailAuth);
app.use("/auth/withdraw", withdraw);

app.use(() => mongoose.disconnect());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`서버가 작동중 입니다 포트는 -->> ${PORT} 로딩중...`));
