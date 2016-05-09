//Lineups service used to communicate Lineups REST endpoints
(function () {
  'use strict';

  angular
    .module('lineups')
    .factory('LineupsService', LineupsService);

  LineupsService.$inject = ['$resource'];

  function LineupsService($resource) {
    return $resource('api/lineups/:lineupId', {
      lineupId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
