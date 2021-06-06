const emailSender = require("../utils/emailSender");

module.exports = (eventEmiiter) => {
  eventEmiiter.on("user-registered", (user) => {
    emailSender.send({
      to: user.emailAddress,
      subject: "Welcome to TalentQL Facebook",
      html: `
            <h4>Dear ${user.firstName},</h4>
        
            <p>Welcome to TalentQL Facebook.</p>

            <p>We are glad to have you on board.</p><br>

            <p>Regards,</p>
            <p>The TalentQL Facebook Team</p>
        `,
    });
  });
};
