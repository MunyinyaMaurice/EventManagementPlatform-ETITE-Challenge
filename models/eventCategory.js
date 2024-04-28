const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, "Please add the name of category"],
  },
  categoryDesc: {
    type: String,
    required: [true, "please add event category decription"],
  },
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
  ],
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
