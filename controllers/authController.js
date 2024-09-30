const User = require("../modules/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Find user by username
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: existingUser._id }, JWT_SECRET, {
      expiresIn: "2d",
    });
    // Respond with token
    res.status(200).json({ token, userRole: existingUser.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
};
