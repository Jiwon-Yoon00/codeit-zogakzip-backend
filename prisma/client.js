import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

app.get('/some-endpoint', async (req, res) => {
  // PrismaClient�� ����Ͽ� �����ͺ��̽� ���� ����
  const result = await prisma.someModel.findMany();
  res.json(result);
});