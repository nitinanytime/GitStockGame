'use strict';

/**
 * Module dependencies
 */
var adminstufsPolicy = require('../policies/adminstufs.server.policy'),
  adminstufs = require('../controllers/adminstufs.server.controller');

module.exports = function(app) {
  // Adminstufs Routes
  app.route('/api/adminstufs').all(adminstufsPolicy.isAllowed)
    .get(adminstufs.list)
    .post(adminstufs.create);

  app.route('/api/adminstufs/:adminstufId').all(adminstufsPolicy.isAllowed)
    .get(adminstufs.read)
    .put(adminstufs.update)
    .delete(adminstufs.delete);

  // Finish by binding the Adminstuf middleware
  app.param('adminstufId', adminstufs.adminstufByID);
};
