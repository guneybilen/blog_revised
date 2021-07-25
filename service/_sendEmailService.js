// This mail service is for using the mailtrap.io

const nodemailer = require("nodemailer");

const _sendEmailService = async (options) => {
  // console.log(options);
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "admin <admin@basakblog.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.messageHTML,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = _sendEmailService;
