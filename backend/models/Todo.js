const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    dueDate: String,
    completed: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    file: String, // <-- This stores the uploaded filename
  },
  { timestamps: true }
);

module.exports = mongoose.model('Todo', todoSchema);
