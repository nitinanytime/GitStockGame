(function () {
  'use strict';

  // Playermoves controller
  angular
    .module('playermoves')
    .controller('PlayermovesController', PlayermovesController);

  PlayermovesController.$inject = ['$scope', '$state', 'Authentication', 'playermoveResolve'];

  function PlayermovesController ($scope, $state, Authentication, playermove) {
    var vm = this;

    vm.authentication = Authentication;
    vm.playermove = playermove;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Playermove
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.playermove.$remove($state.go('playermoves.list'));
      }
    }

    // Save Playermove
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.playermoveForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.playermove._id) {
        vm.playermove.$update(successCallback, errorCallback);
      } else {
        vm.playermove.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('playermoves.view', {
          playermoveId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
