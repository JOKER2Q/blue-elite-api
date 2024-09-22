const User = require("../modules/user");
const bcrypt = require("bcrypt");
const logActivity = require("../middlewares/activityLogger");
const allUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users); // Return users as JSON
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send("An error occurred while fetching users.");
  }
};
const getAUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const userProfile = async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body; // Create a new user instance

    // Hash the password
    // Check if the user already exists

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with roles
    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || "user", // Default to 'user' role if no roles provided
    });

    await newUser.save();
    // Log the activity
    await logActivity(
      req.user._id,
      "CREATE",
      newUser._id,
      `Created user with the username: ${newUser.username} as an ${newUser.role}`,
      "user"
    );
    res.status(201).json(newUser); // Respond with the created user
  } catch (err) {
    console.error(err);
    res.status(400).send("An error occurred while creating the user.");
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params; // Get user ID from request parameters
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).send("User not found.");
    }
    // Log the activity
    await logActivity(
      req.user._id,
      "DELETE",
      deletedUser._id,
      `Deleted ${deletedUser.username}`,
      "user"
    );
    res.status(200).send("User deleted successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while deleting the user.");
  }
};

module.exports = {
  allUsers,
  createUser,
  deleteUser,
  userProfile,
  getAUser,
};
