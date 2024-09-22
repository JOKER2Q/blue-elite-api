const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
  headline: {
    type: Map, // Use a Map to store multiple languages
    of: String,
    required: true,
  },
  summary: {
    type: Map, // Use a Map to store multiple languages
    of: String,
    required: true,
  },
  photo: {
    type: String, // Single string for photo URL
    required: true,
  },
});

// Create and export the model
const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
