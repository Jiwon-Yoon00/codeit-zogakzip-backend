const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// 📌 미들웨어 설정
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// 📌 그룹 관련 라우트 추가
const groupRoutes = require('./src/routes/groupRoutes'); // ✅ routes 폴더에서 가져오기!
app.use('/api/groups', groupRoutes);

// 📌 기본 테스트용 라우트 (서버 정상 작동 여부 확인)
app.get('/', (req, res) => {
    res.send('✅ 서버 실행 중!');
});

// 📌 Express 앱을 외부에서 사용할 수 있도록 내보내기
module.exports = app;
