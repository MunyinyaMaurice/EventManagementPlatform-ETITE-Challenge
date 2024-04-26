const asyncHandler = require("express-async-handler");
const Booking = require('../models/bookings');
const Event = require('../models/eventModel');
const User = require('../models/userModel');

//@desc Get all booking
//@route GET /api/bookings
//@access private
const getBookings = asyncHandler(async (req, res) => {
    const booking = await Booking.find();
    res.status(200).json(booking);
  });

//@desc Create New booking
//@route POST /api/bookings
//@access private
const createBooking = asyncHandler(async (req, res) => {
    console.log("The request body is :", req.body);
    const { eventId, userId, ticketsBooked } = req.body;
    if (!eventId || !userId || !ticketsBooked ) {
      res.status(400);
      throw new Error("All fields are mandatory !");
    }
    const newBooking = await Booking.create({
        eventId, userId, ticketsBooked
    //   user_id: req.user.id,
    });
    // Update the corresponding event's ticketsBooked count
    await Event.findByIdAndUpdate(eventId, {
        $inc: { ticketsBooked: ticketsBooked }
      });
  
  
    res.status(201).json(newBooking);
  });

  //@desc Get user bookings
//@route GET /api/bookings
//@access private
const getUserBookings = asyncHandler(async (req, res) => {
    const userId= req.params.id;
    const user = await User.findById(userId);
    if(!user){
        res.status(404);
      throw new Error("User not found !");
    }
    const bookings = await Booking.find({ userId });
    res.status(200).json(bookings);
  });

   //@desc cancel user bookings
//@route GET /api/bookings
//@access private
const cancelBooking = asyncHandler(async (req, res) => {
    const bookingId= req.params.id;
    const booking = await Booking.findById(bookingId);
    if(!booking){
        res.status(404);
      throw new Error("Booking not found !");
    }
    // Update booking status to CANCELED
    booking.status = 'CANCELED';
    await booking.save();

    // Update the corresponding event's ticketsBooked count
    await Event.findByIdAndUpdate(booking.eventId, {
        $inc: { ticketsBooked: -booking.ticketsBooked }
    });

    res.status(200).json({ message: 'Booking canceled successfully', booking });
  });

  module.exports = {
    getBookings,
    createBooking,
    getUserBookings,
    // updateBooking,
    cancelBooking,
  };