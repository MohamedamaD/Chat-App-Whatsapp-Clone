const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
});

const sendMail = async (to, subject, text, html) => {
  var mailOptions = {
    from: process.env.AUTH_EMAIL,
    to,
    subject,
    text,
    html,
  };

  const response = await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
