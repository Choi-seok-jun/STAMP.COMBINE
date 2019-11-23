module.exports = {
  jwtSecret: process.env.TOKEN_KEY || "lacaztte",
  jwtSession: {
    session: false
  }
};
