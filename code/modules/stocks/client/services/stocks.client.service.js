//Stocks service used to communicate Stocks REST endpoints
(function () {
  'use strict';

  angular
    .module('stocks')
    .factory('StocksService', StocksService);

  StocksService.$inject = ['$resource'];

  function StocksService($resource) {
    return $resource('api/stocks/:stockId', {
      stockId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
