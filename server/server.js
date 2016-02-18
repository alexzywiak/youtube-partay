/*jslint node: true */
'use strict';

var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');

module.exports = function(app, express) {

  var router = express.Router();

  if(process.env.NODE_ENV === 'dev'){
    app.use(morgan('dev'));
  }

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());

  app.use(express.static(path.join(__dirname, '../client')));

  app.use('/api', router);
  
  require('./routes/router')(router);
};
