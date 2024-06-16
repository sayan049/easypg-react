const nodemailer = require('nodemailer');
const User = require('../modules/user');
const PgOwner = require('../modules/pgProvider');

async function sendmailOwner(name,email,userId){
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
// verifying route email
// exports.verifyMail = async(req,res)=>{
//     try {
//         const updateInfo = await User.updateOne ({_id : req.query.id},{$set : {is_verified:1}});
//         console.log(updateInfo);
//     } catch (error) {
//         console.log("Error: ", error);
//     }
// }
module.exports = sendmailOwner;