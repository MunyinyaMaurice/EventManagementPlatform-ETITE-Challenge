const express = require("express");
const {
  registerUser,
  currentUser,
  loginUser,
  updateUser,
  getAllUsers

} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");
const checkRole = require("../middleware/checkRole");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);

router.use(validateToken);

router.route("/:id").put(updateUser );

router.route("/").get(checkRole('ADMIN'), getAllUsers)

module.exports = router;
