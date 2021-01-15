const nodemailer = require('nodemailer');

const sendPurchasedEmailToCouple = (
  coupleUsername,
  coupleEmail,
  productName,
  guestFirst,
  guestLast,
  guestEmail,
  googleUrl
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_ADDRESS,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  console.log(
    'process.env.GMAIL_ADDRESS',
    process.env.GMAIL_ADDRESS,
    process.env.GMAIL_PASSWORD
  );
  const mailOptions = {
    from: 'somethingnewreg@gmail.com',
    to: 'paul.e.ramirez@gmail.com',
    subject: `An item in your registry has been purchased!`,
    text: `${guestFirst} ${guestLast} has purchased ${productName} from your registry: ${googleUrl}. You should thank them by sending a nice message to ${guestEmail}.`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = sendPurchasedEmailToCouple;
