/**
 * @class metadisk/engine
 */

'use strict';

const assert = require('assert');
const express = require('express');

const Config = require('./config');
const Storage = require('./storage');
const Network = require('./network');
const Server = require('./server');

/**
 * Primary interface to metadisk (the glue)
 * @constructor
 * @param {Config} config
 */
function Engine(config) {
  if (!(this instanceof Engine)) {
    return new Engine(config);
  }

  assert(config instanceof Config, 'Invalid config supplied');

  this.storage = new Storage(config.storage);
  this.network = new Network(config.network);
  this.server = new Server(this._configureApp());
}

/**
 * Configures the express app and loads routes
 * #_configureApp
 */
Engine.prototype._configureApp = function() {
  const routers = Server.Routes(this.storage, this.network);
  const app = express();

  /* configure app middleware here */

  for (let name in routers) {
    let router = routers[name];

    router.forEach(function(route) {
      let verb = route[0].toLowerCase();
      let path = route[1];
      let handler = route[2];

      app[verb](path, handler);
    });
  }

  return app;
};