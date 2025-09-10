const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/database");

const router = express.Router();
const SECRET_KEY = "my_secret_key"; // 환경변수로 빼는 게 좋음

// 회원가입
router.post("/register", (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ message: "모든 항목을 입력해주세요." });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: "비밀번호 암호화 오류" });

    db.run(
      "INSERT INTO teachers (email, name, password) VALUES (?, ?, ?)",
      [email, name, hash],
      function (err) {
        if (err) return res.status(500).json({ message: "회원가입 실패 (이메일 중복?)" });
        res.json({ message: "회원가입 성공", teacherId: this.lastID });
      }
    );
  });
});

// 로그인
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM teachers WHERE email = ?", [email], (err, user) => {
    if (!user) return res.status(401).json({ message: "사용자를 찾을 수 없습니다." });

    bcrypt.compare(password, user.password, (err, result) => {
      if (!result) return res.status(401).json({ message: "비밀번호가 올바르지 않습니다." });

      const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET_KEY, { expiresIn: "1h" });
      res.json({ token });
    });
  });
});

module.exports = router;
