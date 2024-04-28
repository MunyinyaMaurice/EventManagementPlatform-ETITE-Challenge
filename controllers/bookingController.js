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
  const event = await Event.findById(req.params.id);
  if(!event){
    res.status(404);
    throw new error("Event not found");
  }

  const eventId = req.params.id;
    const {ticketsBooked } = req.body;
// Validate ticketCapacity (must be greater than or equal to zero)
if (typeof ticketsBooked !== 'number' || ticketCapacity < 0 || !ticketsBooked) {
  res.status(400);
  throw new Error("Ticket capacity must be a non-negative number");
}
    const newBooking = await Booking.create({
        eventId, 
        ticketsBooked,
        user_id: req.user.id
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
    const bookings = await Booking.find({ user_id: req.user.id });
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
    if(booking.user_id.toString() !== req.user.id){
      req.status(403);
      throw new console.error("user is not autherized to cancel this booking");
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
    cancelBooking,
  };