
import nodemailer from "nodemailer";

const SMTP_USER = process.env.EMAIL_ID;
const SMTP_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: SMTP_USER, pass: SMTP_PASS }
});

export default async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: `Converse <${SMTP_USER}>`,
      to,
      subject,
      html
    });
    console.log("Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Error in sendEmail:", err);
    throw err;
  }
}
