const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail", // or your email provider
    auth: {
        user: "cleanease_prabin@gmail.com", 
        pass: "clean ease siuu",  
    },
});

const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
        from: "cleanease_prabin@gmail.com",
        to,
        subject,
        text,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully.");
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = { sendEmail };
