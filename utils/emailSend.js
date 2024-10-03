const nodemailer = require("nodemailer");

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465, // Use 465 for SSL, or 587 for TLS
  secure: true, // true for SSL, false for TLS
  auth: {
    user: process.env.EMAIL, // e.g., 'yourname@yourdomain.com'
    pass: process.env.EMAIL_PASSWORD, // Your email password
  },
});
async function emailSend({ from, subject, body, file }) {
  const to = "support@blue-elite.tech";
  const senderEmail = process.env.EMAIL; // Should match the authenticated email
  if (file) {
    const mailOptions = {
      from: senderEmail, // Sender's email
      to: to, // Recipient's email
      subject: "Blue Elite Tech application", // Subject of the email
      text: `${body}`, // Body of the email
      attachments: [
        {
          filename: file.originalname, // Original file name
          path: file.path, // File path on the server
          content: file.buffer,
        },
      ],
    };

    // Send the email using Nodemailer
    await transporter.sendMail(mailOptions);
  } else {
    const mailOptions = {
      from: senderEmail, // Sender's email
      to: to, // Recipient's email
      subject: "Blue Elite Tech service", // Subject of the email
      text: `${body}`, // Body of the email
    };

    // Send the email using Nodemailer
    await transporter.sendMail(mailOptions);
  }
}

module.exports = { emailSend };
