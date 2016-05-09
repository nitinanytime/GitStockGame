'use strict';

/**
 * Module dependencies
 */
var lineupsPolicy = require('../policies/lineups.server.policy'),
  lineups = require('../controllers/lineups.server.controller');

module.exports = function(app) {
  // Lineups Routes
  app.route('/api/lineups').all(lineupsPolicy.isAllowed)
    .get(lineups.list)
    .post(lineups.create);

  app.route('/api/lineups/:lineupId').all(lineupsPolicy.isAllowed)
    .get(lineups.read)
    .put(lineups.update)
    .delete(lineups.delete);

  // Finish by binding the Lineup middleware
  app.param('lineupId', lineups.lineupByID);
};
