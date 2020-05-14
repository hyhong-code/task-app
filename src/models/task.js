const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const Task = new mongoose.model("Task", taskSchema);

module.exports = Task;
