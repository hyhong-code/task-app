const mongoose = require("mongoose");

const Task = new mongoose.model("Task", {
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  owner: {
    // owner stores type ObjectId
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // creats a reference from this field to User model
    ref: "User",
  },
});

module.exports = Task;
