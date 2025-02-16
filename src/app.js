import 'dotenv/config';
import express from 'express';
import cors from 'cors'; // CORS 추가
import path from 'path';
import postRoutes from './routes/postRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import groupController from './controllers/groupController.js';

const app = express();
app.use(express.json());
app.use(cors()); // 모든 도메인에서의 요청을 허용

const PORT = 3000;

// 라우트 추가
app.use('/api/posts', postRoutes);
app.use('/api/image', imageRoutes);
app.use('', groupController); // 기존 main 브랜치 코드 유지

// 정적 파일 서빙 (업로드된 이미지에 접근 가능하게 설정)
app.use('/uploads', express.static('uploads'));

// React의 빌드된 정적 파일을 제공
app.use(express.static(path.join(process.cwd(), 'Client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'Client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
=======
import 'dotenv/config';
import express from 'express';
import cors from 'cors'; // CORS 추가
import path from 'path';
import postRoutes from './routes/postRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import groupController from './controllers/groupController.js';

const app = express();
app.use(express.json());
app.use(cors()); // 모든 도메인에서의 요청을 허용

const PORT = 3000;

// 라우트 추가
app.use('/api/posts', postRoutes);
app.use('/api/image', imageRoutes);
app.use('', groupController); // 기존 main 브랜치 코드 유지

// 정적 파일 서빙 (업로드된 이미지에 접근 가능하게 설정)
app.use('/uploads', express.static('uploads'));

// React의 빌드된 정적 파일을 제공
app.use(express.static(path.join(process.cwd(), 'Client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'Client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
