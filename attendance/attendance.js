const express = require("express");
const router = express.Router();
const db = require("../db/database");  // database.js 경로 지정


// 학생 조회
router.get("/students", async (req, res) => {
    const { grade, class: classNum, number } = req.query;

    let query = "SELECT * FROM students WHERE 1=1";
    const params = [];

    if (grade) {
        query += " AND grade = ?";
        params.push(grade);
    }
    if (classNum) {
        query += " AND class = ?";
        params.push(classNum);
    }
    if (number) {
        query += " AND number = ?";
        params.push(number);
    }

    const rows = await db.all(query, params);
    res.json(rows);
});

// 출결 등록/수정
router.post("/", async (req, res) => {
    const { student_id, date, status } = req.body;

    const student = await db.get("SELECT * FROM students WHERE id = ?", [student_id]);
    if (!student) return res.status(404).json({ error: "학생이 없습니다." });

    await db.run(
        `INSERT INTO attendance (student_id, date, status) 
         VALUES (?, ?, ?)
         ON CONFLICT(student_id, date) DO UPDATE SET status=excluded.status`,
        [student_id, date, status]
    );

    res.json({ success: true });
});

// 출결 조회
router.get("/", async (req, res) => {
    const { student_id, date } = req.query;

    let query = "SELECT * FROM attendance WHERE 1=1";
    const params = [];

    if (student_id) {
        query += " AND student_id = ?";
        params.push(student_id);
    }
    if (date) {
        query += " AND date(date) = date(?)";
        params.push(date);
    }

    const rows = await db.all(query, params);
    res.json(rows);
});

module.exports = router;
