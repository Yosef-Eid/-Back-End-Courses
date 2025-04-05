import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path, { extname, basename } from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
dotenv.config();

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // upload folder
        const uploadPath = path.join(__dirname, '../upload');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // generate filename
        const ext = extname(file.originalname);
        const name = basename(file.originalname, ext).replace(/\s/g, '-');
        cb(null, `${name}-${Date.now()}${ext}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // validate file type
        if (file.fieldname === 'video') {
            if (!file.mimetype.startsWith('video/')) {
                return cb(new Error('Only video files are allowed!'), false);
            }
        } else if (file.fieldname === 'thumbnail') {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new Error('Only image files are allowed for thumbnail!'), false);
            }
        }
        cb(null, true);
    },
});

const uploadToCloudinary = async (filePath, resourceType) => {
    try {
        // upload file to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: resourceType,
            folder: resourceType === 'video' ? 'videos' : 'thumbnails'
        });
        // delete local file after uploading
        fs.unlinkSync(filePath); 
        return result.secure_url;
    } catch (error) {
        console.error(`Error uploading ${resourceType}:`, error);
        return null;
    }
};

// configure Multer middleware
const uploadFiles = upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]);

const processFiles = async (req, res, next) => {
    try {
        // validate files
        if (!req.files || !req.files.video) {
            return res.status(400).json({ message: "Video is required!" });
        }

        const videoPath = req.files.video[0].path;
        const videoUrl = await uploadToCloudinary(videoPath, 'video');

        let thumbnailUrl = null;
        if (req.files.thumbnail) {
            const thumbnailPath = req.files.thumbnail[0].path;
            thumbnailUrl = await uploadToCloudinary(thumbnailPath, 'image');
        }

        req.videoUrl = videoUrl;
        req.thumbnailUrl = thumbnailUrl;
        next();
    } catch (error) {
        console.error('Error processing files:', error);
        res.status(500).json({ message: 'File upload failed' });
    }
};

export const deleteFromCloudinary = async (fileUrl) => {
    if (!fileUrl) return;
    try {
        // delete file from Cloudinary
        const publicId = fileUrl.split('/').pop().split('.')[0]; 
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
    }
};

export { uploadFiles, processFiles };
