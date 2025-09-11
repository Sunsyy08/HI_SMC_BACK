const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const db = new sqlite3.Database("database.db");

// 테이블 생성
db.serialize(() => {
  // 교사 계정 테이블
  db.run(`
    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      name TEXT,
      password TEXT
    )
  `);

  // 공지 테이블
  db.run(`
    CREATE TABLE IF NOT EXISTS notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 학생 테이블
  db.run(`
        CREATE TABLE IF NOT EXISTS Students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            studentId TEXT UNIQUE,
            name TEXT,
            major TEXT,
            passwordHash TEXT
        )
    `, (err) => {
        if (err) console.error(err.message);
        else console.log("Students 테이블 생성 완료");
    });

  // 출결 테이블
  db.run(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      date DATETIME NOT NULL,
      status TEXT NOT NULL,
      FOREIGN KEY (student_id) REFERENCES students(id)
    )
  `);
});

module.exports = db;
