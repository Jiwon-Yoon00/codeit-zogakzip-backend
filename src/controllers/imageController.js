import multer from 'multer';
import path from 'path';

const imageFileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extension = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(extension)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG and PNG files are allowed!'), false);
    }
};

export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        const originalName = file.originalname.split('.')[0];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${originalName}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

export const uploadImage = multer({ storage: storage, fileFilter: imageFileFilter }).single('image');
