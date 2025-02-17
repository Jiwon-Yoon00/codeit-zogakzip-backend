import express from "express";
import cors from "cors"; // CORS 추가
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { Sequelize } from "sequelize"; // DB 연결 추가
import postRoutes from './src/routes/postRoutes.js';
import imageRoutes from './src/routes/imageRoutes.js';
import groupRoutes from './src/routes/groupRoutes.js';
import commentRoutes, { commentEditRouter } from "./src/routes/commentRoutes.js";
import './src/services/badgeScheduler.js'; // 배지 스케줄러 관련 서비스

dotenv.config();

const app = express();
app.use(express.json());

// 미들웨어 설정
app.use(cors()); // 모든 도메인에서의 요청을 허용
app.use(helmet());
app.use(morgan("dev"));

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

// 라우트 설정
app.use('/api/posts', postRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/groups', groupRoutes); // 그룹 라우트
app.use('/api/posts', commentRoutes); // 댓글 라우트
app.use('/api/comments', commentEditRouter); // 댓글 수정 라우트

// 정적 파일 서빙 (업로드된 이미지에 접근 가능하게 설정)
app.use('/uploads', express.static('uploads'));

// 기본 테스트용 라우트 (서버 정상 작동 여부 확인)
app.get("/", (req, res) => {
    res.send("✅ 서버 정상 실행 중!");
});

// 서버 실행 (DB 연결 후 실행)
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    await connectDB(); // MySQL 연결
    await sequelize.sync({ alter: true }); // DB 테이블 동기화

    app.listen(PORT, () => {
        console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
    });
};

startServer();

export default app;
