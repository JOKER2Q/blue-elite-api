const express = require("express");
const multer = require("multer");
const { emailSend } = require("../utils/emailSend");
const router = express.Router();

const storage = multer.memoryStorage(); // Use memory storage to avoid saving the file
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10 MB
  },
});

// Route to handle email sending with an attachment
router.post("/send", upload.single("file"), async (req, res) => {
  const { from, subject, body } = req.body;
  const file = req.file;

  try {
    // Use the service to send the email
    await emailSend({ from, subject, body, file });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error });
  }
});

module.exports = router;
