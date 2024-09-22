const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema for a User with roles
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"], // You can add more roles here if needed
    default: "user", // Default role for new users
  },
});
// Hash the password before saving the user

// Create the model using the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
