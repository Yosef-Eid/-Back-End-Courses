import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path, { basename, extname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Configure Multer storage (temporary local storage before Cloudinary upload)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../upload');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const ext = extname(file.originalname);
        const name = basename(file.originalname, ext).replace(/\s/g, '-');
        cb(null, `${name}-${Date.now()}${ext}`);
    }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Configure Multer middleware
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter
}).fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'background', maxCount: 1 }
]);

// Function to upload file to Cloudinary
const uploadToCloudinary = async (filePath, folder) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, { folder });
        fs.unlinkSync(filePath); // Delete the local file after uploading
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        return null;
    }
};

export { upload, uploadToCloudinary };
