(function () {
  'use strict';

  // Adminstufs controller
  angular
    .module('adminstufs')
    .controller('AdminstufsController', AdminstufsController);

  AdminstufsController.$inject = ['$scope', '$state', 'Authentication', 'adminstufResolve'];

  function AdminstufsController ($scope, $state, Authentication, adminstuf) {
    var vm = this;

    vm.authentication = Authentication;
    vm.adminstuf = adminstuf;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Adminstuf
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.adminstuf.$remove($state.go('adminstufs.list'));
      }
    }

    // Save Adminstuf
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.adminstufForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.adminstuf._id) {
        vm.adminstuf.$update(successCallback, errorCallback);
      } else {
        vm.adminstuf.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('adminstufs.view', {
          adminstufId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
