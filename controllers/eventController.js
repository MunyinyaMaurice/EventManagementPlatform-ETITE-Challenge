const asyncHandler = require("express-async-handler");
const Event = require('../models/eventModel');

//@desc Get all event
//@route GET /api/events
//@access private
const getEvents = asyncHandler(async (req, res) => {
    const event = await Event.find();
    res.status(200).json(event);
  });

//@desc Create New event
//@route POST /api/events
//@access private
const createEvent = asyncHandler(async (req, res) => {
    console.log("The request body is :", req.body);
    const { title, date, location, ticketCapacity } = req.body;
    if (!title || !date || !location || !ticketCapacity) {
      res.status(400);
      throw new Error("All fields are mandatory !");
    }
    const event = await Event.create({
        title, 
        date, 
        location, 
        ticketCapacity
    //   user_id: req.user.id,
    });
  
    res.status(201).json(event);
  });
  //@desc Get event
//@route GET /api/events/:id
//@access private
const getEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404);
      throw new Error("event not found");
    }
    res.status(200).json(event);
  });
  
//@desc Update event
//@route PUT /api/events/:id
//@access private
const updateEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404);
      throw new Error("event not found");
    }
  
    // if (event.user_id.toString() !== req.user.id) {
    //   res.status(403);
    //   throw new Error("User don't have permission to update other user events");
    // }
  
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
  
    res.status(200).json(updatedEvent);
  });
  
  //@desc Delete event
  //@route DELETE /api/events/:id
  //@access private
  const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404);
      throw new Error("event not found");
    }
    // if (event.user_id.toString() !== req.user.id) {
    //   res.status(403);
    //   throw new Error("User don't have permission to update other user events");
    // }
    await Event.deleteOne({ _id: req.params.id });
    res.status(200).json(event);
  });
  

  module.exports = {
    getEvents,
    createEvent,
    getEvent,
    updateEvent,
    deleteEvent,
  };