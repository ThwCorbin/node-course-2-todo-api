const mongoose = require("mongoose");

let Todo = mongoose.model("Todo", {
    text: {
      type: String,
      required: true,
      minLength: 1,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Number,
      default: null
    },
    // call this prop whatever, but _ before name
    // signals that the schema type is an ObjectId
    _creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  });

  module.exports = {Todo}; // same as Todo: Todo
  