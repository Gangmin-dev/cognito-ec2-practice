const express = require("express");
const router = express.Router();
const { signIn } = require("../lib/cognito");

router.post("/", function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send("로그인 정보 부족");
  }
  signIn(req.body).then((result) =>
    res.status(result.statusCode).json(result.response)
  );
});

module.exports = router;
