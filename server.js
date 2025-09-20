const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable CORS for all origins (or restrict to your Netlify URL)
app.use(cors({
  origin: 'https://helpful-nasturtium-73fb49.netlify.app', // or '*' for all
  methods: ['GET','POST']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files if needed
app.use(express.static(path.join(__dirname, '../frontend')));

// Handle form submission
app.post('/submit', (req, res) => {
    const { email, option } = req.body;

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: "New Reward Submission",
        text: `Option: ${option}\nEmail: ${email}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
            return res.status(500).send('Error sending email');
        }
        console.log('Email sent: ' + info.response);
        res.send('Your email was successfully sent to the admin!');
    });
});

// Default route for frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
