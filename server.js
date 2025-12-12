// server.js
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// parse json body
app.use(express.json());

// serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// contact endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body || {};

  if(!name || !email || !message){
    return res.status(400).send('Name, email and message are required.');
  }

  // Configure transporter - replace with your SMTP credentials!
  // For testing, consider nodemailer SMTP ethereal or any real SMTP.
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465
    auth: {
      user: process.env.SMTP_USER || 'username',
      pass: process.env.SMTP_PASS || 'password'
    }
  });

  const mailOptions = {
    from: `"EasyRoute Enquiries" <${process.env.SMTP_FROM || 'no-reply@easyroute.com'}>`,
    to: process.env.ENQUIRY_TO || 'hello@easyroute.com',
    subject: `New enquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\n\nMessage:\n${message}`
  };

  try{
    // send mail
    await transporter.sendMail(mailOptions);
    return res.status(200).send('ok');
  } catch(err) {
    console.error('Mail error', err);
    return res.status(500).send('Failed to send email: ' + (err && err.message));
  }
});

app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname,'public','index.html'));
});

app.listen(PORT, ()=> console.log(`EasyRoute site running on http://localhost:${PORT}`));
