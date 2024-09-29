const nodemailer = require("nodemailer");

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // or other service providers
  auth: {
    user: process.env.EMAIL, // Replace with your email
    pass: process.env.EMAIL_PASSWORD, // Replace with your email password or app-specific password
  },
});

async function emailSend({ from, subject, body, file }) {
  const to = "rawantemmo@gmail.com";
  if (file) {
    const mailOptions = {
      from: "your-email@gmail.com", // Sender's email
      to: to, // Recipient's email
      subject: "Blue Elite Tech application", // Subject of the email
      text: `from : ${from} \n ${body}`, // Body of the email
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
      from: "your-email@gmail.com", // Sender's email
      to: to, // Recipient's email
      subject: "Blue Elite Tech service", // Subject of the email
      text: `${body}`, // Body of the email
    };

    // Send the email using Nodemailer
    await transporter.sendMail(mailOptions);
  }
}

module.exports = { emailSend };
