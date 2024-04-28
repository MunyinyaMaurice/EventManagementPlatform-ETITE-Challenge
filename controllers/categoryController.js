const asyncHandler = require("express-async-handler");
const Category = require('../models/eventCategory');
const Image = require('../models/Images'); 
const path = require("path");
const fs = require("fs");

//@desc Get all Category
//@route GET /api/Categories
//@access private
const getCategories = asyncHandler(async (req, res) => {
    const category = await Category.find();
    res.status(200).json(category);
  });

//@desc Create New Category
//@route POST /api/Categories
//@access private
const createCategory = asyncHandler(async (req, res) => {
    const { categoryName, categoryDesc } = req.body;
    if (!categoryName || !categoryDesc ) {
      res.status(400);
      throw new Error("All fields are mandatory !");
    }
     // Validate title uniqueness
  const existingCategory = await Category.findOne({ categoryName });
  if (existingCategory) {
    res.status(409); 
    throw new Error("Category with this Name already exists");
  }

    const category = await Category.create({
        categoryName,
        categoryDesc,
    });
  
    res.status(201).json(category);
  });
  //@desc Get Category
//@route GET /api/categories/:id
//@access private
const getCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id).populate('events');
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    res.status(200).json(category);
  });
  
//@desc Update Category
//@route PUT /api/Categories/:id
//@access private
const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    const updatedCategoryData = req.body;
    
    if (!category) {
      res.status(404);
      throw new Error("Category id not found");
    }
      // Validate title uniqueness
      const existingCategory = await Category.findOne( updatedCategoryData.categoryName );
      if (existingCategory) {
        res.status(409); 
        throw new Error("Category with this Name already exists");
      }
    
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updatedCategoryData,
      { new: true }
    );
  
    res.status(200).json(updatedCategory);
  });
  
  //@desc delete an Category 
  //@route DELETE /api/categories/:id
  //@access private
  
const deleteCategory = asyncHandler(async (req, res) => {
  // Find the Category by ID
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  // Delete the Category from MongoDB
  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "Category deleted successfully" });
});

  module.exports = {
    getCategories,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,
  };