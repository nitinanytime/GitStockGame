//Paymenthistories service used to communicate Paymenthistories REST endpoints
(function () {
  'use strict';

  angular
    .module('paymenthistories')
    .factory('PaymenthistoriesService', PaymenthistoriesService);

  PaymenthistoriesService.$inject = ['$resource'];

  function PaymenthistoriesService($resource) {
    return $resource('api/paymenthistories/:paymenthistoryId', {
      paymenthistoryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
