module.exports = asyncFn => {
  return async (req, res, next) => {
    try {
      return await asyncFn(req, res, next);
    } catch (error) {
      console.error(error, typeof (error));
      if (error.code) {
        (error.code === 11000) // DB 중복값 존재
          && res.status(500).json({ error: "DB duplicate", msg: error.errmsg })
      } else if (error.toString().split(":")[0] === "ReferenceError") {
        res.status(500).json({ error: "ReferenceError", msg: "서버 변수 미지정 오류" })
      } else {
        res.status(500).json({ error: "unknown", msg: "확인되지 않은 새로운 에러 입니다." });
      }
      return next();
    }
  };
};
