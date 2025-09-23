const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Allow Netlify frontend
app.use(cors({
  origin: 'https://helpful-nasturtium-73fb49.netlify.app', 
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// ✅ Parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Root route for health check
app.get('/', (req, res) => {
  res.send('✅ Backend is running');
});

// ✅ Handle form submission
app.post('/submit', async (req, res) => {
  const { email, option } = req.body;

  if (!email || !option) {
    return res.status(400).send('❌ Missing email or option');
  }

  console.log("📩 Received form submission:", req.body);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL, // send to yourself
      subject: "🎁 New Reward Submission",
      text: `Option: ${option}\nEmail: ${email}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);

    res.send('✅ Your email was successfully sent to the admin!');
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    res.status(500).send('❌ Error sending email: ' + error.message);
  }
});

// ✅ Serve frontend (if needed)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
