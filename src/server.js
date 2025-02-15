import dotenv from "dotenv";
import app from "./app.js"; // ? ES 모듈 방식으로 변경
import { connectDB, sequelize } from "./src/config/database.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB(); // MySQL 연결 확인
    await sequelize.sync({ alter: true }); // 데이터베이스 테이블 동기화

    // ? Express 서버 실행
    app.listen(PORT, () => {
        console.log(`? 서버 실행 중: http://localhost:${PORT}`);
    });
};

startServer();