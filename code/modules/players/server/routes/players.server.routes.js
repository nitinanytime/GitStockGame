'use strict';

/**
 * Module dependencies
 */
var playersPolicy = require('../policies/players.server.policy'),
  players = require('../controllers/players.server.controller');

module.exports = function(app) {
  // Players Routes
  app.route('/api/players').all(playersPolicy.isAllowed)
    .get(players.list)
    .post(players.create);

  app.route('/api/players/:playerId').all(playersPolicy.isAllowed)
    .get(players.read)
    .put(players.update)
    .delete(players.delete);

  // Finish by binding the Player middleware
  app.param('playerId', players.playerByID);
};
