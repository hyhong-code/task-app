const sgMail = require("@sendgrid/mail");

const SEND_GRID_API = "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";

sgMail.setApiKey(SEND_GRID_API);

const sendWelcomeEmail = (email, name) => {
  console.log(email, name);
  sgMail.send({
    to: email,
    from: "hong961127@gmail.com",
    subject: "Welocme to task app!",
    text: `Welcome to the app ${name}, let me know how you get along with the app!`,
  });
  console.log("sent");
};

module.exports = {
  sendWelcomeEmail,
};
