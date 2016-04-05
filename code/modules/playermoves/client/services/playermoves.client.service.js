//Playermoves service used to communicate Playermoves REST endpoints
(function () {
  'use strict';

  angular
    .module('playermoves')
    .factory('PlayermovesService', PlayermovesService);

  PlayermovesService.$inject = ['$resource'];

  function PlayermovesService($resource) {
    return $resource('api/playermoves/:playermoveId', {
      playermoveId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
