
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
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../cloudinary/cloudinaryConfig');
// Set up Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // Folder in Cloudinary
        format: async (req, file) => 'jpg', // Force format (optional)
        public_id: (req, file) => `${file.fieldname}-${Date.now()}`
    }
});

// Configure Multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 1500000 }, // 1.5 MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb('Error: Only images are allowed!');
        }
    }
}).fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'messPhoto', maxCount: 10 }
]);

module.exports = upload;

