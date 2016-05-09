//Adminstufs service used to communicate Adminstufs REST endpoints
(function () {
  'use strict';

  angular
    .module('adminstufs')
    .factory('AdminstufsService', AdminstufsService);

  AdminstufsService.$inject = ['$resource'];

  function AdminstufsService($resource) {
    return $resource('api/adminstufs/:adminstufId', {
      adminstufId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
