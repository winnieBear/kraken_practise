'use strict';


var kraken = require('kraken-js'),
  mysql = require('./lib/dbMysql'),
  language = require('./lib/language'),
  errHandle = require('./lib/errHandle'),
  user = require('./lib/user'),
  express = require('express'),
  app = {};


app.configure = function configure(nconf, next) {
  // Fired when an app configures itself
  //Configure the database
  mysql.init(nconf.get('mysqlConfig'));
  next(null);
};


app.requestStart = function requestStart(server) {
  // Run before most express middleware has been registered.
  /*    var logFile = require('fs').createWriteStream('./log/kraken.log', {flags: 'a'});
    server.use(express.logger({stream:logFile}));*/
  var log4js = require('log4js');
  log4js.configure({
    appenders: [ //{type: 'console'},
      {
        type: 'file',
        filename: './log/kraken.log',
        category: 'dev'
      }
    ]
  });

  var logger = log4js.getLogger('dev');
  logger.setLevel('DEBUG');

  server.use(log4js.connectLogger(logger, {
    level: log4js.levels.DEBUG
  }));

};


app.requestBeforeRoute = function requestBeforeRoute(server) {
  // Run before any routes have been added.
  server.use(express.methodOverride());
  server.use(language());
  server.use(user());
};


app.requestAfterRoute = function requestAfterRoute(server) {
  // Run after all routes have been added.
  server.use(errHandle);
};

// handling  errors
/*app.use(function(err, req, res, next) {
  if(err.status !== 404) {
    return next();
  }
 
  ///res.send(err.message || '** no unicorns here **');
  res.send(500,err);
});*/


if (require.main === module) {
  kraken.create(app).listen(function (err, server) {
    if (err) {
      console.error(err.stack);
    }
  });
}


module.exports = app;
