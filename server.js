const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Enable CORS for your frontend
app.use(cors({
  origin: 'https://helpful-nasturtium-73fb49.netlify.app', 
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// ✅ Parse JSON & form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📩 Handle form submission
app.post('/submit', (req, res) => {
  console.log("Received data:", req.body); // Debug log

  const { email, option } = req.body;

  if (!email || !option) {
    return res.status(400).send("❌ Missing email or option");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for 587
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: "📩 New Reward Submission",
    text: `Option: ${option}\nEmail: ${email}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Error sending email:", error);
      return res.status(500).send("Error sending email");
    }
    console.log("✅ Email sent:", info.response);
    res.send("Your email was successfully sent to the admin!");
  });
});

// ✅ Simple root route (instead of frontend index.html)
app.get('/', (req, res) => {
  res.send("Backend is running ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
