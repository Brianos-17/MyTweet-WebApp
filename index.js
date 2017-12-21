'use strict';

/**
 *Index.js creates, initialises and runs the HAPI server instance
 */
const Hapi = require('hapi');
const utils = require('./app/api/utils.js');

var server = new Hapi.Server();
server.connection({ port: process.env.PORT || 4000 });
require('./app/models/db');//Connects to the mongoose instances and starts up the MongoDB

server.register([require('inert'), require('vision'), require('hapi-auth-cookie'),
  require('hapi-auth-jwt2')], err => {

  if (err) {
    throw err;
  }

  //Sets up Server to interpret hbs views & partials
  server.views({
    engines: {
      hbs: require('handlebars'),
    },
    relativeTo: __dirname,
    path: './app/views',
    layoutPath: './app/views/layout',
    partialsPath: './app/views/partials',
    layout: true,
    isCached: false,
  });

  server.auth.strategy('standard', 'cookie', {
    password: 'secretpasswordnotrevealedtoanyone',
    cookie: 'donation-cookie',
    isSecure: false,
    ttl: 24*60*60*1000,
    redirectTo: '/login',
  });

  server.auth.strategy('jwt', 'jwt', {
    key: 'secretpasswordnotrevealedtoanyone',
    validateFunc: utils.validate,
    verifyOptions: { algorithms: ['HS256'] },
  });

  server.auth.default({
    strategy: 'standard',
  });

  server.route(require('./routes'));
  server.route(require('./routesapi'));//routes for testing the api

  server.start((err) => {
    if (err) {
      throw err;
    }

    console.log('Server listening at:', server.info.uri);
  });

});