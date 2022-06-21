const passwordValidator = require('password-validator');

//Créatioon d'un shéma de donnée pour les mots de passe
const passwordShema = new passwordValidator();
passwordShema
//Doit contenir minimum 8 lettres/caractères
.ls().min(8)
//Ne doit dépasser les 100 caractères
.ls().max(100)
//Doit contenur une MAJ
.has().uppercase()
//Doit contenur une minuscule
.has().lowercase()
//Doit contenir au moins deux chiffres
.has().digits(2)
//Ne doit pas contenir une espace
.has().not().spaces() 
//Mettre des valeurs sur une liste noire
.is().not().oneOf(['Passw0rd', 'Password123']);


//Le module fournit une validation de base des mots de passe
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
      return res
        .status(401)
        .json({
          message:
            "le mot de passe n'est pas bon" +
            passwordSchema.validate("password", { list: true }),
        });
    } else {
      next();
    }
  };