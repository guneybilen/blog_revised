// This mail service is for using the mailgun.com

const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");

const mailgunAuth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
};

const sendEmailService = async (options) => {
  const transporter = nodemailer.createTransport(mg(mailgunAuth));

  const mailOptions = {
    from: "admin <admin@example.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.messageHTML,
  };

  transporter.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("Successfully sent email.");
    }
  });
};

module.exports = sendEmailService;
