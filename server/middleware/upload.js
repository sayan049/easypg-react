
// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//     destination: path.join(__dirname, '../uploads'), // Save in uploads folder
//     filename: (req, file, cb) => {
//         const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
//         cb(null, uniqueName);
//     }
// });

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1500000 }, // 1.5 MB limit
//     fileFilter: (req, file, cb) => {
//         const filetypes = /jpeg|jpg|png|gif/;
//         const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//         const mimetype = filetypes.test(file.mimetype);
//         if (mimetype && extname) {
//             cb(null, true);
//         } else {
//             cb('Error: Only images are allowed!');
//         }
//     }
// }).fields([
//     { name: 'profilePhoto', maxCount: 1 },
//     { name: 'messPhoto', maxCount: 10 }
// ]);

// module.exports = upload;
const multer = require('multer');
const sharp = require('sharp');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../cloudinary/cloudinaryConfig'); // Cloudinary configuration
const path = require('path');
const fs = require('fs');

// Temporary local folder for processing files
const tempDir = './temp';
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

// Multer temporary storage for pre-compression files
const tempStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Configure multer with temporary storage and file validation
const uploadTemp = multer({
    storage: tempStorage,
    limits: { fileSize: 110 * 1024 * 1024 }, // 110MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|heic|heif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb('Error: Only image files are allowed!');
        }
    }
}).fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'messPhoto', maxCount: 10 }
]);

// Function to compress images
const compressImage = async (inputPath, outputPath) => {
    await sharp(inputPath)
        .toFormat('jpeg', { quality:60 }) // Convert to JPEG with 60% quality
        .toFile(outputPath);
};

// Middleware to handle compression and Cloudinary upload
const uploadToCloudinary = async (req, res, next) => {
    try {
        if (!req.files) return next();

        const cloudinaryResults = {};

        for (const field in req.files) {
            const files = req.files[field];
            cloudinaryResults[field] = [];

            for (const file of files) {
                const compressedPath = `${tempDir}/compressed-${file.filename}`;
                
                // Compress the file
                await compressImage(file.path, compressedPath);

                // Upload compressed file to Cloudinary
                const result = await cloudinary.uploader.upload(compressedPath, {
                    public_id: path.parse(file.originalname).name,
                    folder: '' // No folder, upload to root
                });

                // Save the Cloudinary URL
                cloudinaryResults[field].push(result.secure_url);

                // Clean up temporary files
                fs.unlinkSync(file.path); // Original file
                fs.unlinkSync(compressedPath); // Compressed file
            }
        }

        req.cloudinaryResults = cloudinaryResults; // Attach URLs to request
        next();
    } catch (error) {
        console.error('Error processing files:', error);
        res.status(500).json({ error: 'Error processing uploaded files' });
    }
};

// Export the middleware functions
module.exports = {
    uploadTemp,
    uploadToCloudinary
};


