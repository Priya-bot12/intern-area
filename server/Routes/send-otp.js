const express = require('express');
const nodemailer = require('nodemailer');
const validator = require("validator");
const router = express.Router();

// ✅ Corrected transporter configuration (using App Passwords)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail email
    pass: process.env.APP_PASSWORD, // Use the generated App Password
  },
});

router.post('/', async (req, res) => {
  const { email, otp } = req.body;

  try {
    // ✅ Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }


    const info = await transporter.sendMail({
      from: `Your App <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Login OTP',
      text: `Your OTP is: ${otp} (Valid for 5 minutes)`,
      html: `
        <div>
          <h2>Your Login OTP</h2>
          <p style="font-size: 18px; color: #2563eb;">${otp}</p>
          <p>This OTP is valid for 5 minutes</p>
        </div>
      `,
    });

    console.log('Message sent: %s', info.messageId);
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message || 'Server error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
