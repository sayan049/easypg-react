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
// const multer = require('multer');
// const sharp = require('sharp');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('../cloudinary/cloudinaryConfig'); // Cloudinary configuration
// const path = require('path');
// const fs = require('fs');

// // Temporary local folder for processing files
// // const tempDir = './temp';
// const tempDir = path.join(__dirname, '../temp');

// if (!fs.existsSync(tempDir)) {
//     fs.mkdirSync(tempDir);
// }

// // Multer temporary storage for pre-compression files
// const tempStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, tempDir);
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//     }
// });

// // Configure multer with temporary storage and file validation
// const uploadTemp = multer({
//     storage: tempStorage,
//     limits: { fileSize: 110 * 1024 * 1024 }, // 110MB limit
//     fileFilter: (req, file, cb) => {
//         const filetypes = /jpeg|jpg|png|gif|heic|heif/;
//         const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//         const mimetype = filetypes.test(file.mimetype);
//         if (mimetype && extname) {
//             cb(null, true);
//         } else {
//             cb('Error: Only image files are allowed!');
//         }
//     }
// }).fields([
//     { name: 'profilePhoto', maxCount: 1 },
//     { name: 'messPhoto', maxCount: 10 }
// ]);

// // Function to compress images
// const compressImage = async (inputPath, outputPath) => {
//     await sharp(inputPath)
//         .webp({ quality: 75 }) // You can adjust quality between 60-80
//         .toFile(outputPath);
// };

// // Middleware to handle compression and Cloudinary upload
// const uploadToCloudinary = async (req, res, next) => {
//     try {
//         if (!req.files) return next();

//         const cloudinaryResults = {};

//         for (const field in req.files) {
//             const files = req.files[field];
//             cloudinaryResults[field] = [];

//             for (const file of files) {
//                 const compressedPath = `${tempDir}/compressed-${path.parse(file.filename).name}.webp`;

//                 // Compress the file
//                 await compressImage(file.path, compressedPath);

//                 // Upload compressed file to Cloudinary
//                 const result = await cloudinary.uploader.upload(compressedPath, {
//                     public_id: path.parse(file.originalname).name,
//                     folder: '',
//                     resource_type: 'image',
//                     format: 'webp' // ensure cloudinary keeps it as webp
//                 });

//                 // Save the Cloudinary URL
//                 cloudinaryResults[field].push(result.secure_url);

//                 // Clean up temporary files
//                 try { fs.unlinkSync(file.path); } catch (e) { console.warn("Original file not found", e); }
//                 try { fs.unlinkSync(compressedPath); } catch (e) { console.warn("Compressed file not found", e); }

//             }
//         }

//         req.cloudinaryResults = cloudinaryResults; // Attach URLs to request
//         next();
//     } catch (error) {
//         console.error('Error processing files:', error);
//         res.status(500).json({ error: 'Error processing uploaded files' });
//     }
// };

// // Export the middleware functions
// module.exports = {
//     uploadTemp,
//     uploadToCloudinary
// };

const multer = require("multer");
const sharp = require("sharp");
const cloudinary = require("../cloudinary/cloudinaryConfig");
const path = require("path");
const fs = require("fs");
const os = require("os");

// Use system temp directory (safe for platforms like Render)
const tempDir = os.tmpdir();

// Multer disk storage setup
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

// Multer upload config
const uploadTemp = multer({
  storage: tempStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 200MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|heic|heif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
}).fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "messPhoto", maxCount: 10 },
]);

// Helper to compress image
const compressImage = async (inputPath, outputPath) => {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file is missing: ${inputPath}`);
  }

  await sharp(inputPath).webp({ quality: 75 }).toFile(outputPath);
};

// Middleware to upload to Cloudinary
const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No files found in request.");
      return next(); // no files uploaded
    }

    const cloudinaryResults = {};

    for (const field in req.files) {
      const files = req.files[field];
      cloudinaryResults[field] = [];

      for (const file of files) {
        const originalPath = file.path;
        const compressedFilename = `compressed-${
          path.parse(file.filename).name
        }.webp`;
        const compressedPath = path.join(tempDir, compressedFilename);
        console.log(`\n📥 Received file: ${file.originalname}`);
        console.log(`→ Saved temporarily at: ${originalPath}`);

        // Check original file exists
        if (!fs.existsSync(originalPath)) {
            console.error(`❌ File not found at path: ${originalPath}`);
          return next({
            status: 400,
            message: `File not found: ${file.originalname}`,
          });
        }
 console.log(`🛠 Compressing ${file.originalname}...`);
        // Compress
        await compressImage(originalPath, compressedPath);
      console.log(`✅ Compressed and saved to: ${compressedPath}`);
        // Upload
        const result = await cloudinary.uploader.upload(compressedPath, {
          public_id: path.parse(file.originalname).name,
          folder: "", // Optional: 'messmate/profilePhotos'
          resource_type: "image",
          format: "webp",
        });
 console.log(`✅ Uploaded to Cloudinary: ${result.secure_url}`);
        cloudinaryResults[field].push(result.secure_url);

        // Clean up
        try {
          fs.unlinkSync(originalPath);
            console.log(`🧹 Deleted original file: ${originalPath}`);
        } catch (e) {
          console.warn("Could not delete original", e);
        }
        try {
          fs.unlinkSync(compressedPath);
              console.log(`🧹 Deleted compressed file: ${compressedPath}`);
        } catch (e) {
          console.warn("Could not delete compressed", e);
        }
      }
    }

    req.cloudinaryResults = cloudinaryResults;
    console.log("🎉 All files processed and uploaded successfully.");
    next();
  } catch (error) {
    console.error("File upload error:", error);
    next({
      status: 500,
      message: "Failed to upload or process image. Please try again.",
    });
  }
};

module.exports = {
  uploadTemp,
  uploadToCloudinary,
};
