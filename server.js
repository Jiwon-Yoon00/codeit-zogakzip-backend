require('dotenv').config(); // 환경 변수 로드
const app = require('./app'); // app.js에서 Express 앱 가져오기
const { connectDB, sequelize } = require('./src/config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB(); // MySQL 연결 확인

    await sequelize.sync({ alter: true }); // 데이터베이스 테이블 동기화

    // 📌 Express 서버 실행 (올바른 코드)
    app.listen(PORT, () => {
        console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
    });
};

startServer();
