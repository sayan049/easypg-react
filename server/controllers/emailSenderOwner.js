const nodemailer = require('nodemailer');
require('dotenv').config();

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;

async function sendmailOwner(name,email,userId){
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:USER_EMAIL,
            pass:USER_PASSWORD
        }
    })
    const mailOptions = {
        from:USER_EMAIL,
        to:  email,
        subject:'Verification Email',
        html:'<h3>Hi, '+name+' Click <a href="http://localhost:3000/MailVerifyOwner?id='+userId+'">here</a> to verify you email </h3>'
    }
    try {
        const result = await transporter.sendMail(mailOptions);
        console.log("email has ben sent succesfully");
    } catch (error) {
        console.log("Error: ",error);
    }

}

module.exports = sendmailOwner;