(function () {
  'use strict';

  // Players controller
  angular
    .module('players')
    .controller('PlayersController', PlayersController);

  PlayersController.$inject = ['$scope', '$state', 'Authentication', 'playerResolve'];

  function PlayersController ($scope, $state, Authentication, player) {
    var vm = this;

    vm.authentication = Authentication;
    vm.player = player;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    console.log(vm.authentication);
    // Remove existing Player
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.player.$remove($state.go('players.list'));
      }
    }

    // Save Player
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.playerForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.player._id) {
        vm.player.$update(successCallback, errorCallback);
      } else {
        vm.player.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('players.view', {
          playerId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
