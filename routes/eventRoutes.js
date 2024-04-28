const express = require("express");
const router = express.Router();
const {
  getEvents,
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/EventController");
const validateToken = require("../middleware/validateTokenHandler");
const checkRole = require("../middleware/checkRole");

router.use(validateToken);

router.route("/").get(getEvents);
router.route("/:id").get(getEvent).post(checkRole('ADMIN'), createEvent).put(checkRole('ADMIN'), updateEvent).delete(checkRole('ADMIN'), deleteEvent);

module.exports = router;
