const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  ticketCapacity: {
    type: Number,
    required: true,
  },
  ticketsBooked: {
    type: Number,
    default: 0,
  },
  images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image',
    },
  ],
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
