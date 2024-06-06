// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Ensure uploads directory exists
// const uploadDir = path.join(__dirname, '../uploads');
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
//     }
// });

// function checkFileType(file, cb) {
//     const filetypes = /jpeg|jpg|png|gif/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);

//     if (mimetype && extname) {
//         return cb(null, true);
//     } else {
//         cb('Error: Images Only!');
//     }
// }

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1000000 },
//     fileFilter: (req, file, cb) => {
//         checkFileType(file, cb);
//     }
// }).fields([
//     { name: 'profilePhoto', maxCount: 1 },
//     { name: 'messPhoto', maxCount: 10 }
// ]);

// module.exports = upload;


//server/middleware/upload.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads/'),
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1500000 }, // Limit file size to 1.5 MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
}).fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'messPhoto', maxCount: 10 }
]);

module.exports = upload;