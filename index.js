const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const noticeRoutes = require("./routes/notice");
const attendanceRouter = require("./attendance/attendance");
const db = require("./db/database");


const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// 정적 파일 제공 (프론트엔드 연결)
app.use(express.static(path.join(__dirname, "public")));

// API 라우트
app.use("/api/auth", authRoutes);
app.use("/api/notice", noticeRoutes);

// 출결관리 라우터 불러오기
app.use("/attendance", attendanceRouter);

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

