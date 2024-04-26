const asyncHandler = require("express-async-handler");
const Event = require('../models/eventModel');
const Image = require('../models/Images'); 
const path = require("path");
const fs = require("fs");

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
    const event = await Event.findById(req.params.id).populate('images');
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
  
  //@desc delete an event and its associated images
  //@route DELETE /api/events/:id
  //@access private
  // controllers/imageController.js
const deleteEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.id;

  // Find the event by ID
  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  // Delete all associated images from the filesystem
  for (const imageId of event.images) {
    const image = await Image.findById(imageId);
    if (image) {
      const imagePath = path.join(__dirname, '..', image.imagePath);
      fs.unlinkSync(imagePath); // Delete image file from filesystem
      await Image.findByIdAndDelete(imageId); // Delete image document from MongoDB
    }
  }

  // Delete the event from MongoDB
  await Event.findByIdAndDelete(eventId);

  res.status(200).json({ message: "Event and associated images deleted successfully" });
});

  module.exports = {
    getEvents,
    createEvent,
    getEvent,
    updateEvent,
    deleteEvent,
  };