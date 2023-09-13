const nodemailer = require('nodemailer');

// Create a Nodemailer transporter using MailHog SMTP
const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 1025, // MailHog SMTP port
    secure: false, // Use TLS (if false, use plaintext)
});

// Email message configuration
const mailOptions = {
    from: 'your-email@example.com',
    to: 'recipient@example.com',
    subject: 'Test Email',
    text: 'This is a test email sent using MailHog and Nodemailer.',
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending email:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});
