'use strict';

/**
 * Module dependencies
 */
var paymenthistoriesPolicy = require('../policies/paymenthistories.server.policy'),
  paymenthistories = require('../controllers/paymenthistories.server.controller');

module.exports = function(app) {
  // Paymenthistories Routes
  app.route('/api/paymenthistories').all(paymenthistoriesPolicy.isAllowed)
    .get(paymenthistories.list)
    .post(paymenthistories.create);

  app.route('/api/paymenthistories/page/:page').all()
    .get(paymenthistories.paymenthistorieslist)

  app.route('/api/sendPayoutBulk').all(paymenthistoriesPolicy.isAllowed)
    .get(paymenthistories.sendPayoutBulk)

  app.route('/api/paymenthistory/update').all()
    .put(paymenthistories.updateAdmin)

  app.route('/api/paymenthistories/success').all()
    .get(paymenthistories.success); 

  app.route('/api/paymenthistories/cancel').all()
    .get(paymenthistories.cancel); 

  app.route('/api/paymenthistories/:paymenthistoryId').all(paymenthistoriesPolicy.isAllowed)
    .get(paymenthistories.read)
    .put(paymenthistories.update)
    .delete(paymenthistories.delete);

  // Finish by binding the Paymenthistory middleware
  app.param('paymenthistoryId', paymenthistories.paymenthistoryByID);
};
