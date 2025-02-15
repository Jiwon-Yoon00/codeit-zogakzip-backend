import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import { Sequelize } from "sequelize"; // ✅ DB 연결 추가

dotenv.config();

const app = express();

// 📌 미들웨어 설정
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// ✅ MySQL 데이터베이스 직접 연결 (database.js 없이 설정)
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  logging: false,
});

// ✅ DB 연결 함수
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL 데이터베이스 연결 성공!");
  } catch (error) {
    console.error("❌ MySQL 연결 실패:", error);
    process.exit(1);
  }
};

// 📌 그룹 관련 라우트 추가
import groupRoutes from "./src/routes/groupRoutes.js";
app.use("/api/groups", groupRoutes);

// 📌 댓글 관련 라우트 추가
import commentRoutes, { commentEditRouter } from "./src/routes/commentRoutes.js";
app.use("/api/posts", commentRoutes);
app.use("/api/comments", commentEditRouter);

// 📌 기본 테스트용 라우트 (서버 정상 작동 여부 확인)
app.get("/", (req, res) => {
    res.send("✅ 서버 정상 실행 중!");
});

// ✅ 서버 실행 (DB 연결 후 실행)
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    await connectDB(); // ✅ MySQL 연결 실행
    await sequelize.sync({ alter: true }); // ✅ DB 테이블 동기화

    app.listen(PORT, () => {
        console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
    });
};

startServer();

export default app;
