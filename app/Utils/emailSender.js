const nodemailer = require("nodemailer");

module.exports = {
  send: async (data) => {
    if (process.env.NODE_ENV == "test") {
      return;
    }

    let testAccount = await nodemailer.createTestAccount();

    let host = process.env.SMTP_HOST || "smtp.ethereal.email";
    let user = process.env.SMTP_USER || testAccount.user;
    let pass = process.env.SMTP_PASSWORD || testAccount.pass;
    let port = process.env.SMTP_PORT || 587;
    let isSecure = process.env.SMTP_SSL == "true";

    let transporter = nodemailer.createTransport({
      host,
      port,
      secure: isSecure,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"Talent QL Facebook" <talentql@example.com>',
      to: data.to,
      subject: data.subject,
      html: data.html,
    });

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  },
};
