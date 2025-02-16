import dotenv from "dotenv";
import app from "./app.js"; // ? ES ��� ������� ����
import { connectDB, sequelize } from "./src/config/database.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB(); // MySQL ���� Ȯ��
    await sequelize.sync({ alter: true }); // �����ͺ��̽� ���̺� ����ȭ

    // ? Express ���� ����
    app.listen(PORT, () => {
        console.log(`? ���� ���� ��: http://localhost:${PORT}`);
    });
};

startServer();