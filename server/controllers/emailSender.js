const nodemailer = require('nodemailer');
require('dotenv').config();

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;
const frontendUrl = process.env.CLIENT_URL || 'http://localhost:3000';

async function sendmail(name, email, userId) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: USER_EMAIL,
            pass: USER_PASSWORD
        }
    })
 /* The `mailOptions` object is being used to define the details of the email that will be sent. Here's
 a breakdown of its properties: */
    const mailOptions = {
        from: USER_EMAIL,
        to: email,
        subject: 'Verification Email',
        // html: '<h3>Hi, ' + name + ' Click <a href="https://easypg-react-client.onrender.com/MailVerify?id=' + userId + '">here</a> to verify you email </h3>'
         html : `<h3>Hi, ${name}. Click <a href="${frontendUrl}/MailVerify?id=${userId}">here</a> to verify your email.</h3>`

    }
    try {
        const result = await transporter.sendMail(mailOptions);
        console.log("email has ben sent succesfully");
    } catch (error) {
        console.log("Error: ", error);
    }

} 

module.exports = sendmail;