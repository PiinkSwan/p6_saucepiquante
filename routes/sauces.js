const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const likesCtrl = require('../controllers/likes')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config');

//Créer et mdoifier une sauces / Séparation de la logique métier entre les routes et controllers
router.post("/", auth, multer, saucesCtrl.createSauce);
router.get("/", auth, saucesCtrl.getAllSauces);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
router.delete("/:id", auth, saucesCtrl.deleteSauce);

//Révision de l'ajout et de la suoppression des sauces
router.post('/:id/like',auth, likesCtrl.addLikeOrDislike);

module.exports = router;
