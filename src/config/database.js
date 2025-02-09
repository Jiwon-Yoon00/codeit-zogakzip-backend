const { Sequelize } = require('sequelize');
require('dotenv').config(); // .env 파일 로드

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT,
        logging: false, // SQL 로그 출력 비활성화
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL 연결 성공!');
    } catch (error) {
        console.error('❌ MySQL 연결 실패:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };

