import multer from 'multer';
import path from 'path';
import fs from 'fs'; // Import the filesystem module to manage directories.

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
        const uploadDir = './uploads'; // Define the directory name for uploads.

        // Check if the directory exists.
        if (!fs.existsSync(uploadDir)) {
            // If the directory does not exist, create it.
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Pass the directory to the callback, it now definitely exists.
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const originalName = file.originalname.split('.')[0];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${originalName}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

export const uploadImage = multer({ storage: storage, fileFilter: imageFileFilter }).single('image');
