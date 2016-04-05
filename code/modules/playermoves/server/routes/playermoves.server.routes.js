'use strict';

/**
 * Module dependencies
 */
var playermovesPolicy = require('../policies/playermoves.server.policy'),
  playermoves = require('../controllers/playermoves.server.controller');

module.exports = function(app) {
  // Playermoves Routes
  app.route('/api/playermoves').all(playermovesPolicy.isAllowed)
    .get(playermoves.list)
    .post(playermoves.create);

  app.route('/api/playermoves/:playermoveId').all(playermovesPolicy.isAllowed)
    .get(playermoves.read)
    .put(playermoves.update)
    .delete(playermoves.delete);

  // Finish by binding the Playermove middleware
  app.param('playermoveId', playermoves.playermoveByID);
};
