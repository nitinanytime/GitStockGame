'use strict';

/**
 * Module dependencies
 */
var stocksPolicy = require('../policies/stocks.server.policy'),
  stocks = require('../controllers/stocks.server.controller');

module.exports = function(app) {
  // Stocks Routes
  app.route('/api/stocks').all(stocksPolicy.isAllowed)
    .get(stocks.list)
    .post(stocks.create);

  app.route('/api/stocks/:stockId').all(stocksPolicy.isAllowed)
    .get(stocks.read)
    .put(stocks.update)
    .delete(stocks.delete);

  // Finish by binding the Stock middleware
  app.param('stockId', stocks.stockByID);
};
