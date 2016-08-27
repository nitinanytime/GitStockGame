(function () {
  'use strict';

  // Notifications controller
  angular
    .module('notifications')
    .controller('NotificationsController', NotificationsController);

  NotificationsController.$inject = ['$scope', '$state', 'Authentication', 'notificationResolve'];

  function NotificationsController ($scope, $state, Authentication, notification) {
    var vm = this;

    vm.authentication = Authentication;
    vm.notification = notification;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Notification
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.notification.$remove($state.go('notifications.list', {}, {reload: true}));
      }
    }

    // Save Notification
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.notificationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.notification._id) {
        vm.notification.$update(successCallback, errorCallback);
      } else {
        vm.notification.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('notifications.view', {
          notificationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
