//Games service used to communicate Games REST endpoints
(function () {
  'use strict';

  angular
    .module('games')
    .factory('GamesService', GamesService);

  GamesService.$inject = ['$resource'];

  function GamesService($resource) {
    return $resource('api/games/:gameId', {
      gameId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
