const express = require("express");
const router = express.Router();
const {
    getBookings,
    createBooking,
    getUserBookings,
    // updateBooking,
    cancelBooking,
} = require("../controllers/bookingController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.route("/").get(getBookings);
router.route("/:id").get(getUserBookings).put(cancelBooking).post(createBooking);

module.exports = router;
