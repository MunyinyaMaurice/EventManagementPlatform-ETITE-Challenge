const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const validateToken = require("../middleware/validateTokenHandler");
const checkRole = require("../middleware/checkRole");

router.use(validateToken);

router.route("/").get(getCategories).post(checkRole('ADMIN'), createCategory);
router.route("/:id").get(getCategory).put(checkRole('ADMIN'), updateCategory).delete(checkRole('ADMIN'), deleteCategory);

module.exports = router;
