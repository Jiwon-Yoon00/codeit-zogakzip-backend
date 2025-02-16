import multer from 'multer';
import path from 'path';

// ���� ���� ����
export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // �̹����� ������ ����
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // ���� �̸� ����
    }
});

export const upload = multer({ storage: storage }).single('image'); // 'image'�� �� �������� �ʵ� �̸�

export const uploadImage = (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(500).json({ message: '�̹��� ���ε� ����', error: err.message });
        }

        // ������ ����� ���ε�Ǿ����� Ȯ��
        if (!req.file) {
            return res.status(400).json({ message: '�̹����� ���ε���� �ʾҽ��ϴ�' });
        }

        // �̹��� URL ���� (��: ������ ������ + �̹��� ���)
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        res.status(200).json({ imageUrl: imageUrl });
    });
};

export default {
    uploadImage,
};