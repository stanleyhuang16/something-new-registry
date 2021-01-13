const nodemailer = require('nodemailer');

const sendReminderEmail = (coupleUsername, email, productName, siteUrl) => {
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
    subject: 'Did you purchase this product?',
    text: `Hello, did you purchase ${productName}? If so, please visit ${siteUrl} and click on "I already bought this"`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = sendReminderEmail;
