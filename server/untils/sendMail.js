
import nodemailer from 'nodemailer';
const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error('Email send failed:', error);
    throw new Error('Email could not be sent');
  }
};

export default sendEmail;
