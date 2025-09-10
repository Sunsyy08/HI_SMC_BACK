const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db/database"); 


const router = express.Router();
const SECRET_KEY = "my_secret_key";

// 토큰 검증 미들웨어
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// 공지 등록 (선생님 전용)
router.post("/add", authenticateToken, (req, res) => {
  const { title, content } = req.body;

  db.run("INSERT INTO notices (title, content) VALUES (?, ?)", [title, content], function (err) {
    if (err) return res.status(500).json({ message: "DB 저장 오류" });
    res.json({ message: "공지 등록 성공", noticeId: this.lastID });
  });
});

// 공지 조회 (학생/학부모)
router.get("/", (req, res) => {
  db.all("SELECT * FROM notices ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ message: "DB 조회 오류" });
    res.json(rows);
  });
});

module.exports = router;
