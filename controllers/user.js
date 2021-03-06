const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();
const TOKEN = process.env.TOKEN;

//Le mot de passe contient au moins 6 caractères, 1 lettre majuscule, 1 lettre minuscule, 1 chiffre ?
isValidPassword = (password) => {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/.test(password);
};
// Email format validation
isValidEmail = (email) => {
    return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
        email
    );
};
// Email mask ( user1@gmail.com become uXXX1@gmail.com)
maskEmail = (email) => {
    let str = email;
    str = str.split("");
    let finalArr = [];
    let len = str.indexOf("@");
    str.forEach((item, pos) => {
        pos >= 1 && pos <= len - 2
            ? finalArr.push("X")
            : finalArr.push(str[pos]);
    });
    let maskedEmail = finalArr.join("");
    return maskedEmail;
};
// Inscription
exports.signup = (req, res, next) => {
    if (isValidPassword(req.body.password) && isValidEmail(req.body.email)) {
        bcrypt
            .hash(req.body.password, 10)
            .then((hash) => {
                const user = new User({
                    email: req.body.email,
                    password: hash,
                    maskedEmail: maskEmail(req.body.email),
                });
                user.save()
                    .then(() =>
                        res.status(201).json({ message: "Utilisateur créé !" })
                    )
                    .catch((error) => res.status(400).json({ error }));
            })
            .catch((error) => res.status(500).json({ error }));
    } else {
        res.status(401).json({
            message: "Votre mot de passe et/ou email est erroné ",
        });
    }
};
// Connexion avec une adresse mail et mot de passe valide
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({
                    error: "Utilisateur non trouvé ! ",
                });
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({
                            error: "Mot de passe incorrect ! ",
                        });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({ userId: user._id }, `${TOKEN}`, {
                            expiresIn: "24h",
                        }),
                    });
                })
            .catch((error) => res.status(500).json({ error }));
        })
    .catch((error) => res.status(500).json({ error }));
};