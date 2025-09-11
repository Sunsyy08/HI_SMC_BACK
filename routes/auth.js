const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/database");


const router = express.Router();
// 🔹 JWT 비밀키 선언 (여기서 반드시 선언)
const JWT_SECRET = "my_super_secret_key"; 

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

// // 선생님 로그인 
// router.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   db.get("SELECT * FROM teachers WHERE email = ?", [email], (err, user) => {
//     if (!user) return res.status(401).json({ message: "사용자를 찾을 수 없습니다." });

//     bcrypt.compare(password, user.password, (err, result) => {
//       if (!result) return res.status(401).json({ message: "비밀번호가 올바르지 않습니다." });

//       const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET_KEY, { expiresIn: "1h" });
//       res.json({ token });
//     });
//   });
// });


// 학생-------------------------------

// -----------------------------
// 회원가입
// -----------------------------
router.post("/signup", async (req, res) => {
  console.log("회원가입 요청 바디:", req.body);
    try {
        let { grade, classNo, studentNo, major, name, password } = req.body;

        // 학번 생성 (학년1 + 반2 + 번호2)
        const studentId = `${grade}${classNo.toString().padStart(2,'0')}${studentNo.toString().padStart(2,'0')}`;

        if (!grade || !classNo || !studentNo || !major || !name || !password) {
            return res.status(400).json({ success: false, message: "모든 항목을 입력하세요." });
        }

        // 비밀번호 해시화
        const passwordHash = await bcrypt.hash(password, 10);

        // DB 저장
        db.run(
            `INSERT INTO Students (studentId, name, major, passwordHash) VALUES (?, ?, ?, ?)`,
            [studentId, name, major, passwordHash],
            function(err) {
                if (err) {
                    if (err.message.includes("UNIQUE")) {
                        return res.status(400).json({ success: false, message: "이미 존재하는 학번입니다." });
                    }
                    return res.status(500).json({ success: false, message: err.message });
                }
                res.json({ success: true, message: "회원가입 완료", studentId });
            }
        );
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// -----------------------------
// 로그인
// -----------------------------
router.post("/login", (req, res) => {
    const { grade, classNo, studentNo, password } = req.body;

    // 학번 5자리 생성
    const studentId = `${grade}${classNo.toString().padStart(2,'0')}${studentNo.toString().padStart(2,'0')}`;

    if (!studentId || !password) {
        return res.status(400).json({ success: false, message: "학번과 비밀번호를 입력하세요." });
    }

    db.get(`SELECT * FROM Students WHERE studentId = ?`, [studentId], async (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!row) return res.status(400).json({ success: false, message: "학번 또는 비밀번호가 잘못되었습니다." });

        const match = await bcrypt.compare(password, row.passwordHash);
        if (!match) return res.status(400).json({ success: false, message: "학번 또는 비밀번호가 잘못되었습니다." });

        // JWT 발급
        const token = jwt.sign(
            { studentId: row.studentId, name: row.name, major: row.major },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({ success: true, token, name: row.name, major: row.major, studentId: row.studentId });
    });
});


module.exports = router;
