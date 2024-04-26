const express = require("express");
const router = express.Router();
const {
  uploadImage,
  deleteImage,
} = require("../controllers/imageController");
const validateToken = require("../middleware/validateTokenHandler");
const checkRole = require("../middleware/checkRole");

router.use(validateToken);

router.route("/:id").post(checkRole('ADMIN'), uploadImage).delete(checkRole('ADMIN'), deleteImage);
// router.route("/:id").get(getEvent).put(checkRole('ADMIN'), updateEvent).delete(checkRole('ADMIN'), deleteEvent);

module.exports = router;
