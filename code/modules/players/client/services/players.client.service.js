//Players service used to communicate Players REST endpoints
(function () {
  'use strict';

  angular
    .module('players')
    .factory('PlayersService', PlayersService);

  PlayersService.$inject = ['$resource'];



  function PlayersService($resource) {
    return $resource('api/players/:playerId', {
      playerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
