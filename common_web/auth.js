const passport = require("passport");
const passportJWT = require("passport-jwt");
const { User: User_web } = require("../models_web/web_user");
const config = require("./jwt_config");

const { ExtractJwt, Strategy } = passportJWT;
const options = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt")
};

module.exports = () => {
  const strategy = new Strategy(options, async (payload, done) => {
    const user_web = await User_web.findById(payload.id);
    if (user_web) {
      return done(null, {
        id: user_web.id,
        name: user_web.name,
        admin: user_web.admin
      });
    } else {
      return done(new Error("user not found"), null);
    }
  });
  passport.use(strategy);
  return {
    initialize() {
      return passport.initialize();
    },
    authenticate() {
      return passport.authenticate("jwt", config.jwtSession);
    }
  };
};
