(function () {
  'use strict';

  angular
    .module('notifications')
    .controller('NotificationsListController', NotificationsListController);

  NotificationsListController.$inject = ['NotificationsService'];

  function NotificationsListController(NotificationsService) {
    var vm = this;

    vm.notifications = NotificationsService.query();
  }
})();
