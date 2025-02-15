
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// 📌 미들웨어 설정
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// 📌 그룹 관련 라우트 추가
import groupRoutes from "./src/routes/groupRoutes.js";
app.use("/api/groups", groupRoutes);

// 📌 댓글 관련 라우트 추가
import commentRoutes, { commentEditRouter } from "./src/routes/commentRoutes.js";
app.use("/api/posts", commentRoutes);

// 📌 댓글 수정 및 삭제는 `/api/comments/:commentId`로 처리
app.use("/api/comments", commentEditRouter);


// 📌 기본 테스트용 라우트 (서버 정상 작동 여부 확인)
app.get("/", (req, res) => {
    res.send("✅ 서버 정상 실행 중!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});

export default app;
