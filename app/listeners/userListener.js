const emailSender = require("../utils/emailSender");

module.exports = (eventEmitter) => {
  eventEmitter.on("user-registered", (user) => {
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

  eventEmitter.on("initiate-password-reset", (user) => {
    emailSender.send({
      to: user.emailAddress,
      subject: "Password reset initiated",
      html: `
            <h4>Dear ${user.firstName},</h4>
        
            <p>You have just initiated a password reset on TalentQL Facebook.</p>

            <p>Please enter the code <strong>${user.passwordResetToken}</strong> where prompted.</p><br>

            <p>Regards,</p>
            <p>The TalentQL Facebook Team</p>
        `,
    });
  });
};
