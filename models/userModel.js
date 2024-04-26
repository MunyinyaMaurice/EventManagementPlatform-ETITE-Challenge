
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please add the user name"],
    unique: [true, "Username already taken"],
  },
  email: {
    type: String,
    required: [true, "Please add the user email address"],
    unique: [true, "Email address already taken"],
  },
  password: {
    type: String,
    required: [true, "Please add the user password"],
  },
  bookings: [{
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    ticketsBooked: {
      type: Number,
      required: [true, "Please add the number of ticket to be booked"],
    },
  }],
  roles: {
    type: String,
    enum: ['ADMIN', 'USER'],
    default: 'USER',
  },
},
{
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
