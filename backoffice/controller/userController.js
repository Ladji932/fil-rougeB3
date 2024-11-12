const nodemailer = require("nodemailer");
const userList = require('../model/model');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const Qrcode = require("qrcode");
const dotenv = require("dotenv").config()

console.log(secretKey)


transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

module.exports.showQrCode = async (req,res) => {
    const { username, email } = req.params;
    const qrData = `User : ${username} , Email : ${email}`;
    
    try {
        const qrCodeUrl = await Qrcode.toDataURL(qrData);
        console.log("QR Code généré avec succès");
        res.send(`
            <html>
                <body>
                    <h1>Votre QR Code</h1>
                    <img src="${qrCodeUrl}" alt="QR Code" />
                </body>
            </html>
        `);
    } catch (err) {
        console.error("Erreur lors de la génération du QR code :", err);
        res.status(500).send("Erreur lors de la génération du QR code.");
    }
}

module.exports.Signup = async (req,res) => {
    const { login, mail, password , phone} = req.body;
    try {
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        const emailExisting = await userList.findOne({email:mail})
        
        if (emailExisting) {
            return res.status(400).json({ message: "This email is already used" });
        }

        const hashedPassword = await bcrypt.hash(password, 10); 

        const newUser = new userList({
            username: login, 
            email: mail,
            password: hashedPassword, 
            phoneNumber: phone
        });

        await newUser.save();
        
        const qrData = `User : ${newUser.username} , Email : ${newUser.email}`;
        Qrcode.toDataURL(qrData, async (err, url) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Erreur lors de la génération du QR code" });
            }

            const mailOptions = {
                from: '"maigaladji47@gmail.com"',
                to: newUser.email,
                subject: "Bienvenue sur Event Ease ! Voici votre QR code",
                html: `
                    <h1>Bienvenue ${newUser.username}!</h1>
                    <p>Merci de vous être inscrit. Voici un lien vers votre QR code :</p>
                    <p><a href="http://localhost:3000/api/qrcode/${newUser.username}/${newUser.email}">Cliquez ici pour voir votre QR code</a></p>
                    <p>À bientôt!</p>
                `,
            };
            

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Erreur lors de l'envoi de l'email", error);
                    return res.status(500).json({ message: "Erreur lors de l'envoi de l'email" });
                }
                res.status(201).json({ message: "User created, email with QR code sent" });
            });


        });


    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error in User creation" });
    }

}

module.exports.Login = async (req,res) =>{
    const { email, password } = req.body;
    try {
        const findUser = await userList.findOne({ email });
        if (!findUser) {
            console.log("User not found");
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const PasswordValidator = await bcrypt.compare(password, findUser.password);
        if (!PasswordValidator) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        const token = jwt.sign({ mail: findUser.email }, secretKey, { expiresIn: '1h' });
        return res.status(200).json({ token, userId: findUser._id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur" });
    }

}
