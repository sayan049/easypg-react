const nodemailer = require('nodemailer');
const User = require('../modules/user');
const PgOwner = require('../modules/pgProvider');

async function sendmail(email){
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'projecteasypg@gmail.com',
            pass:'recwdevnxhxsezuk'
        }
    })
    const mailOptions = {
        from:'projecteasypg@gmail.com',
        to:  email,
        subject:'SORRY',
        text:'sorry bhai ,parle khoma koris'
    }
    try {
        const result = await transporter.sendMail(mailOptions);
        console.log("email has ben sent succesfully",result);
    } catch (error) {
        console.log("Error: ",error);
    }

}
module.exports = sendmail;