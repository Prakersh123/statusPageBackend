
 require('dotenv').config();
 const express = require('express');
 const bodyParser = require('body-parser');
 const cors = require('cors');
 const routes = require('./src/routes');
 
 const app = express();
 
 // Middleware
 app.use(bodyParser.json({ limit: '150mb' }));
 app.use(cors());
 
 routes(app);
 
 module.exports = app;
 