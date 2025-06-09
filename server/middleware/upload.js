// const multer = require("multer");
// const sharp = require("sharp");
// const cloudinary = require("../cloudinary/cloudinaryConfig");
// const path = require("path");
// const fs = require("fs");
// const os = require("os");

// // Use system temp directory (safe for platforms like Render)
// const tempDir = os.tmpdir();

// // Multer disk storage setup
// const tempStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, tempDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(
//       file.originalname
//     )}`;
//     cb(null, uniqueName);
//   },
// });

// // Multer upload config
// const uploadTemp = multer({
//   storage: tempStorage,
//   limits: { fileSize: 15 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     const filetypes = /jpeg|jpg|png|gif|heic|heif/;
//     const extname = filetypes.test(
//       path.extname(file.originalname).toLowerCase()
//     );
//     const mimetype = filetypes.test(file.mimetype);
//     if (mimetype && extname) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed!"));
//     }
//   },
// }).fields([
//   { name: "profilePhoto", maxCount: 1 },
//   { name: "messPhoto", maxCount: 10 },
// ]);

// // Helper to compress image
// const compressImage = async (inputPath, outputPath) => {
//   if (!fs.existsSync(inputPath)) {
//     throw new Error(`Input file is missing: ${inputPath}`);
//   }

//   await sharp(inputPath).webp({ quality: 75 }).toFile(outputPath);
// };

// // Middleware to upload to Cloudinary
// const uploadToCloudinary = async (req, res, next) => {
//   try {
//     if (!req.files || Object.keys(req.files).length === 0) {
//       console.log("No files found in request.");
//       return next(); // no files uploaded
//     }

//     const cloudinaryResults = {};

//     for (const field in req.files) {
//       const files = req.files[field];
//       cloudinaryResults[field] = [];

//       for (const file of files) {
//         const originalPath = file.path;
//         const compressedFilename = `compressed-${
//           path.parse(file.filename).name
//         }.webp`;
//         const compressedPath = path.join(tempDir, compressedFilename);
//         console.log(`\n📥 Received file: ${file.originalname}`);
//         console.log(`→ Saved temporarily at: ${originalPath}`);

//         // Check original file exists
//         if (!fs.existsSync(originalPath)) {
//             console.error(`❌ File not found at path: ${originalPath}`);
//           return next({
//             status: 400,
//             message: `File not found: ${file.originalname}`,
//           });
//         }
//  console.log(`🛠 Compressing ${file.originalname}...`);
//         // Compress
//         await compressImage(originalPath, compressedPath);
//       console.log(`✅ Compressed and saved to: ${compressedPath}`);
//         // Upload
//         const result = await cloudinary.uploader.upload(compressedPath, {
//           public_id: path.parse(file.originalname).name,
//           folder: "", // Optional: 'messmate/profilePhotos'
//           resource_type: "image",
//           format: "webp",
//         });
//  console.log(`✅ Uploaded to Cloudinary: ${result.secure_url}`);
//         cloudinaryResults[field].push(result.secure_url);

//         // Clean up
//         try {
//           fs.unlinkSync(originalPath);
//             console.log(`🧹 Deleted original file: ${originalPath}`);
//         } catch (e) {
//           console.warn("Could not delete original", e);
//         }
//         try {
//           fs.unlinkSync(compressedPath);
//               console.log(`🧹 Deleted compressed file: ${compressedPath}`);
//         } catch (e) {
//           console.warn("Could not delete compressed", e);
//         }
//       }
//     }

//     req.cloudinaryResults = cloudinaryResults;
//     console.log("🎉 All files processed and uploaded successfully.");
//     next();
//   } catch (error) {
//     console.error("File upload error:", error);
//     next({
//       status: 500,
//       message: "Failed to upload or process image. Please try again.",
//     });
//   }
// };

// module.exports = {
//   uploadTemp,
//   uploadToCloudinary,
// };
const multer = require("multer");
const cloudinary = require("../cloudinary/cloudinaryConfig");
const path = require("path");
const fs = require("fs");
const os = require("os");

// Use system temp directory
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
  limits: { fileSize: 18 * 1024 * 1024 }, // 15MB
  fileFilter: (req, file, cb) => {
    console.log("file.originalname:", file.originalname);
    console.log("file.mimetype:", file.mimetype);

    // Accept if mimetype starts with image/
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
}).fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "messPhoto", maxCount: 10 },
]);

// Upload to Cloudinary (no compression, already done on frontend)
const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No files found in request.");
      return next();
    }

    const cloudinaryResults = {};

    for (const field in req.files) {
      const files = req.files[field];
      cloudinaryResults[field] = [];

      await Promise.all(
        files.map(async (file) => {
          const filePath = file.path;

          console.log(`\n📥 Received file: ${file.originalname}`);
          console.log(`→ Path: ${filePath}`);
          console.log(
            `⚡ Skipping compression (already compressed on frontend)`
          );
          const uniqueId = `${
            path.parse(file.originalname).name
          }-${Date.now()}`;
          const result = await cloudinary.uploader.upload(filePath, {
            public_id: uniqueId, // Use unique ID to avoid conflicts
            resource_type: "image",
          });

          console.log(`✅ Uploaded to Cloudinary: ${result.secure_url}`);
          cloudinaryResults[field].push(result.secure_url);

          // Clean up
          try {
            fs.unlinkSync(filePath);
            console.log(`🧹 Deleted temp file: ${filePath}`);
          } catch (e) {
            console.warn("Could not delete temp file", e);
          }
        })
      );
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
