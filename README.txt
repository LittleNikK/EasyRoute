EasyRoute Trips — Quick start

1) Static preview (no backend)
   - Open public/index.html in your browser (works offline).
   - Contact form will attempt to POST to /api/contact; without backend you'll see network error.

2) Run with Node.js backend (to make contact form functional)
   - Install Node.js (v14+).
   - In project root: npm install
   - Set environment variables (example):
       SMTP_HOST=smtp.gmail.com
       SMTP_PORT=587
       SMTP_SECURE=false
       SMTP_USER=youremail@gmail.com
       SMTP_PASS=your-email-password-or-app-password
       SMTP_FROM=no-reply@easyroute.com
       ENQUIRY_TO=hello@easyroute.com
   - Start server: npm start
   - Open http://localhost:3000

Notes:
 - If using Gmail, create an App Password (recommended) and use that as SMTP_PASS.
 - Replace placeholder phone/email in footer with real contact details.
 - Replace demo images in public/ with your own assets in public/assets/ and update srcs.
 - If you prefer no backend, change contact form action to a service like Formspree and follow their docs.
