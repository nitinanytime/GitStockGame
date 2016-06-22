(function () {
  'use strict';

  // Stockhistories controller
  angular
    .module('stockhistories')
    .controller('StockhistoriesController', StockhistoriesController);

  StockhistoriesController.$inject = ['$scope', '$state', 'Authentication', 'stockhistoryResolve'];

  function StockhistoriesController ($scope, $state, Authentication, stockhistory) {
    var vm = this;

    vm.authentication = Authentication;
    vm.stockhistory = stockhistory;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Stockhistory
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.stockhistory.$remove($state.go('stockhistories.list'));
      }
    }

    // Save Stockhistory
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.stockhistoryForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.stockhistory._id) {
        vm.stockhistory.$update(successCallback, errorCallback);
      } else {
        vm.stockhistory.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('stockhistories.view', {
          stockhistoryId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
