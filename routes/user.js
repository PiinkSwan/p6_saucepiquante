const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const rateLimit = require("express-rate-limit");
const apiLimiter = rateLimit ({//Limite la demande de connexion pour éviter le piratage par force brute
    fenêtre : 1 * 60 * 100,
    maxi : 0,
});


router.post('/signup', userCtrl.signup);
router.post('/login', apiLimiter, userCtrl.login);

module.exports = router;
