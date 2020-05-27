const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SEND_GRIP_API_KEY);

const sendWelcomeEmail = (email, name) => {
  console.log("sent email");
  sgMail.send({
    to: email,
    from: "hong961127@gmail.com",
    subject: "Welocme to task app!",
    text: `Welcome to the app ${name}, let me know how you get along with the app!`,
  });
  console.log(`sent welcome email to ${name}, ${email}`);
};

const sendGoodByeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "hong961127@gmail.com",
    subject: "Good Bye!",
    text: `${name}, let me know how to improve!`,
  });
  console.log(`sent goodbye email to ${name}, ${email}`);
};

module.exports = {
  sendWelcomeEmail,
  sendGoodByeEmail,
};
