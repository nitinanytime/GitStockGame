//Stockhistories service used to communicate Stockhistories REST endpoints
(function () {
  'use strict';

  angular
    .module('stockhistories')
    .factory('StockhistoriesService', StockhistoriesService);

  StockhistoriesService.$inject = ['$resource'];

  function StockhistoriesService($resource) {
    return $resource('api/stockhistories/:stockhistoryId', {
      stockhistoryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
