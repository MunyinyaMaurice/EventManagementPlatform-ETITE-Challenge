const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  ticketsBooked: {
    type: Number,
    required: [true, "Please add the number of ticket you wish to book"],
  },
  status: {
    type: String,
    enum: ['BOOKED', 'CANCELED'],
    default: 'BOOKED',
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
