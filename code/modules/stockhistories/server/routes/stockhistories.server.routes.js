'use strict';

/**
 * Module dependencies
 */
var stockhistoriesPolicy = require('../policies/stockhistories.server.policy'),
  stockhistories = require('../controllers/stockhistories.server.controller');

module.exports = function(app) {
  // Stockhistories Routes
  app.route('/api/stockhistories').all(stockhistoriesPolicy.isAllowed)
    .get(stockhistories.list)
    .post(stockhistories.create);

  app.route('/api/stockhistories/:stockhistoryId').all(stockhistoriesPolicy.isAllowed)
    .get(stockhistories.read)
    .put(stockhistories.update)
    .delete(stockhistories.delete);

  // Finish by binding the Stockhistory middleware
  app.param('stockhistoryId', stockhistories.stockhistoryByID);
};
