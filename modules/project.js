const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new Schema({
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
  projectLink: {
    type: String, // Optional project link
  },
});

// Create and export the model
const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
