
const express = require('express');

//Mongoose est un package qui facilite les interactions avec notre base de données
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');

const path = require('path');
const cors = require('cors')

const saucesRoutes = require('./routes/sauces');
const userRoutes = require("./routes/user");

//Lancement du framework Express
const app = express();

const dotenv = require('dotenv')
const result = dotenv.config();
if(result.error){
  throw result.error
}
//Connexion à la base de donnés MongoDB
 mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xl8le.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Middleware CORS = Ajout de header à l'objet " response"
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  
//Désinfecte les inputs contres les injections
app.use(mongoSanitize());

app.use(cors())
//TRansofme le corps de la requête en JSON pour toutes les routes
app.use(bodyParser.json())

//Envoi des log dans le terminal, prise en compte de POSTMAN
app.use(morgan())

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

//Routes images
app.use('/images', express.static(path.join(__dirname, 'images')));
  
module.exports = app;