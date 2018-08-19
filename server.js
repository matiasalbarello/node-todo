// set up ======================================================================
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const router = require('./app/routes.js');

const port = process.env.PORT || 8080;
const connectionString = process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost/todo';

// configuration ===============================================================
mongoose.connect(connectionString);

const app = express();

app.use(express.static('./public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride('X-HTTP-Method-Override'));


// routes ======================================================================
router(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);

module.exports = app;