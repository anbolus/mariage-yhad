const nodemailer = require('nodemailer');
require('dotenv').config();

function sendEmail(from, to, subject, text) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_CONTACT, // Votre adresse Gmail
            pass: process.env.PASSWORD_CONTACT // Votre mot de passe Gmail
        }
    });

    const mailOptions = {
        from: from, // Adresse email de l'expéditeur (l'adresse email saisie par l'utilisateur dans le formulaire)
        to: to, // Adresse email du destinataire (vous pouvez changer cela dans votre route)
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            // Vous pouvez gérer les erreurs ici
        } else {
            console.log('Email envoyé: ' + info.response);
            // Vous pouvez gérer le succès ici
        }
    });
}

module.exports = sendEmail;