const asyncHandler = require("express-async-handler");
const Event = require('../models/eventModel');
const Image = require('../models/Images'); 
const path = require("path");
const fs = require("fs");
const Category = require("../models/eventCategory");
const { error } = require("console");

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
    const category = await Category.findById(req.params.id);
    if(!category){
      res.status(404);
      throw new error("Category id not found");
    }
    const { title, date, location, ticketCapacity } = req.body;
    if (!title || !date || !location || !ticketCapacity) {
      res.status(400);
      throw new Error("All fields are mandatory !");
    }
    // Validate title uniqueness
  const existingEvent = await Event.findOne({ title });
  if (existingEvent) {
    res.status(409); 
    throw new Error("Event with this title already exists");
  }

  // Validate date (must be in the future)
  const eventDate = new Date(date);
  if (eventDate <= new Date()) {
    res.status(400);
    throw new Error("The provided date must be in the future");
  }

  // Validate ticketCapacity (must be greater than or equal to zero)
  if (typeof ticketCapacity !== 'number' || ticketCapacity < 0) {
    res.status(400);
    throw new Error("Ticket capacity must be a non-negative number");
  }
  // Save the event
    const event = await Event.create({
        categoryId:category.id,
        title, 
        date, 
        location, 
        ticketCapacity
    });
      // Add the new event to the event category array
      category.events.push(event.id);
      await category.save();
  
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
  const eventId = req.params.id;
  const updatedEventData = req.body;

  // Validate date (must be in the future)
  if (updatedEventData.date) {
    const eventDate = new Date(updatedEventData.date);
    if (eventDate <= new Date()) {
      res.status(400);
      throw new Error("The provided date must be in the future");
    }
  }

  // Validate ticketCapacity (must be greater than or equal to zero)
  if (updatedEventData.ticketCapacity !== undefined && 
      (typeof updatedEventData.ticketCapacity !== 'number' || updatedEventData.ticketCapacity < 0)) {
    res.status(400);
    throw new Error("Ticket capacity must be a non-negative number");
  }

  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  // Validate title uniqueness if title is being updated
  if (updatedEventData.title && updatedEventData.title !== event.title) {
    const existingEvent = await Event.findOne({ title: updatedEventData.title });
    if (existingEvent) {
      res.status(409); 
      throw new Error("Event with this title already exists");
    }
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    eventId,
    updatedEventData,
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