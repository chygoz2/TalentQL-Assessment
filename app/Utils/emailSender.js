const nodemailer = require("nodemailer");

module.exports = {
  send: async (data) => {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
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
