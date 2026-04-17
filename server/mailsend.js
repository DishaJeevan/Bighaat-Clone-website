const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendMail(to, sub, msg) {
  try {
    const message = {
      to: to,
      from: process.env.EMAIL_FROM,
      subject: sub,
      html: msg,
      attachments: attachments.map(file => ({
        content: file.content.toString("base64"),
        filename: file.filename,
        type: "application/pdf",
        disposition: "attachment",
      })),
    };

    await sgMail.send(message);
    console.log("Email sent successfully via SendGrid");
  } catch (error) {
    console.error("MAIL ERROR:", error.response?.body || error);
  }
}

module.exports = sendMail;
