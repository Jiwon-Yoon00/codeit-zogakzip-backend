import 'dotenv/config';
import express from 'express';
import groupController from './controllers/groupController.js';
import '../src/services/badgeScheduler.js'

const app = express();
app.use(express.json());

app.use('', groupController);

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});