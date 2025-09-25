const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Frontend URL (change if your Netlify domain changes)
const FRONTEND_URL = 'https://helpful-nasturtium-73fb49.netlify.app';

// ✅ Validate environment variables
if (!process.env.ADMIN_EMAIL || !process.env.EMAIL_PASSWORD) {
  console.error("❌ Missing ADMIN_EMAIL or EMAIL_PASSWORD in .env file");
  process.exit(1);
}

// ✅ CORS setup (frontend only)
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200
}));

// ✅ Parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('✅ Backend is running fine');
});

// ✅ Form submission route
app.post('/submit', async (req, res) => {
  const { email, option } = req.body;

  if (!email || !option) {
    return res.status(400).send('❌ Missing email or option');
  }

  console.log("📩 Received form submission:", req.body);

  try {
    // ✅ Nodemailer transporter (Gmail with App Password)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: `"Rewards App" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "🎁 New Reward Submission",
      text: `Option: ${option}\nEmail: ${email}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);

    res.send('✅ Your email was successfully sent to the admin!');
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).send('❌ Error sending email: ' + error.message);
  }
});

// ✅ Redirect all unknown routes to frontend
app.get('*', (req, res) => {
  res.redirect(FRONTEND_URL);
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
