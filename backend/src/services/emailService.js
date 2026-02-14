import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const enabled = Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);

const transporter = enabled
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    })
  : null;

export const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) return;
  await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject,
    html,
  });
};
