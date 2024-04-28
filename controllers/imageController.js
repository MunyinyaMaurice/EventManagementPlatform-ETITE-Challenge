// controllers/imageController.js

const asyncHandler = require("express-async-handler");
const Event = require('../models/eventModel');
const Image = require('../models/Images'); 
const fs = require('fs');
const path = require("path");
const multer = require("multer");
// Define Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images"); // Upload images to the 'images' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename
  },
});

// File type and size validation
const fileFilter = (req, file, cb) => {
  // Allowed file extensions
  const allowedFileTypes = /jpeg|jpg|png|gif/;
  // Check file extension
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check MIME type
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only JPEG, JPG, PNG, and GIF files are allowed"), false); // Reject the file
    // res.status(400);
    // throw new error("Only JPEG, JPG, PNG, and GIF files are allowed");
  }
};

// Initialize Multer upload middleware with file size limit and file type validation
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Max file size: 2 MB
  fileFilter: fileFilter 
});

//@desc upload event image 
//@route POST /api/images/:id
//@access private
const uploadImage = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  // Process file upload using Multer middleware
  upload.single('image')(req, res, async (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      // Create a new Image document in MongoDB
      const newImage = new Image({
        eventId: event._id,
        filename: req.file.filename,
        imagePath: req.file.path,
      });
      await newImage.save();

      // Add the new image to the event's images array
      event.images.push(newImage._id);
      await event.save();

      res.status(201).json(newImage);
    }
  });
});


  //@desc delete event image by image id 
//@route DELETE /api/images/:id
//@access private
const deleteImage = asyncHandler(async (req, res) => {
  const imageId = req.params.id;

  // Find the image by its ID
  const image = await Image.findById(imageId);
  if (!image) {
    res.status(404);
    throw new Error("Image not found");
  }

  // Delete the image from the filesystem
  const imagePath = path.join(__dirname, '..', image.imagePath); // Get full path of the image
  fs.unlinkSync(imagePath); // Delete the image file from the filesystem

  // Remove the image reference from the associated event
  const event = await Event.findById(image.eventId);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  // Remove the image reference from the event's images array
  event.images = event.images.filter(img => img.toString() !== imageId); // Filter out the deleted image
  await event.save();

  // Delete the image document from MongoDB
  await Image.findByIdAndDelete(imageId);

  res.status(200).json({ message: "Image deleted successfully" });
});


module.exports = {
  uploadImage,
  deleteImage,
};




// const asyncHandler = require("express-async-handler");
// const Image = require('../models/images');
// const path  = require("path");
// const multer = require("multer");


// //@desc Upload event image
// //@route POST /api/images
// //@access private
// const uploadImage = asyncHandler(async (req, res) => {
//     const event = await Event.findById(req.params.id);
//     if(!event){
//       res.status(404);
//       throw new error("Event not found");
//     }
  
//     const storage = multer.diskStorage({
//         destination: (req,file, cb) =>{
//             cb(null, "images");
//         },
//         filename: (req,file,cb) => {
//             console.log(file);
//             cb(null,Date.now() + path.extname(file.originalname));
//         },
//     });
//     const upload = multer({ storage: storage});
    
//       res.status(201).json(upload);
//     });
//     module.exports = {
//         uploadImage
//       };