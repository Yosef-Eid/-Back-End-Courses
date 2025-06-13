import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendVerificationEmail = async (email, token) => {
    const verificationLink = `http://yourdomain.com/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email',
        html: `
      <h2>Please verify your email</h2>
      <p>Click the following link to verify your email address:</p>
      <a href="${verificationLink}">${verificationLink}</a>
      <p style="font-size: 23px">Or enter this verification code: ${token}</p>
    `
    };

    await transporter.sendMail(mailOptions);
};