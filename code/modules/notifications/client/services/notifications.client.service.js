//Notifications service used to communicate Notifications REST endpoints
(function () {
  'use strict';

  angular
    .module('notifications')
    .factory('NotificationsService', NotificationsService);

  NotificationsService.$inject = ['$resource'];

  function NotificationsService($resource) {
    return $resource('api/notifications/:notificationId', {
      notificationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
