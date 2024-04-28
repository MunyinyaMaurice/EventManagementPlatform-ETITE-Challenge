const express = require("express");
const {
  registerUser,
  currentUser,
  loginUser,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");
const checkRole = require("../middleware/checkRole");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);

router.put("/:id", validateToken, updateUser );

router.route("/", validateToken).get(checkRole('ADMIN'), getAllUsers)

module.exports = router;
