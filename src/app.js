import express from "express";
import cors from "cors"; // CORS �߰�
import path from "path";
import postRoutes from "./routes/postRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";

const app = express();
app.use(express.json());
app.use(cors()); // ��� �����ο����� ��û�� ���

const PORT = 3000; // ? PORT�� �� ���� ����

app.use("/api/posts", postRoutes);
app.use("/api/image", imageRoutes);

// ���� ���� ���� (���ε�� �̹����� ���� �����ϰ� ����)
app.use("/uploads", express.static("uploads"));

// React�� ����� ���� ������ ����
app.use(express.static(path.join(import.meta.url, "../Client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(import.meta.url, "../Client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`? ���� ���� ��: http://localhost:${PORT}`);
});