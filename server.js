// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Handle form submission
app.post('/submit', (req, res) => {
    const { email, option } = req.body;

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false // ignore self-signed certs (dev only)
        }
    });

    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: process.env.ADMIN_EMAIL, // Admin receives the email
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

// Catch-all route to serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
