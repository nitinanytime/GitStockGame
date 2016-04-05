(function () {
  'use strict';

  // Stocks controller
  angular
    .module('stocks')
    .controller('StocksController', StocksController);

  StocksController.$inject = ['$scope', '$state', 'Authentication', 'stockResolve'];

  function StocksController ($scope, $state, Authentication, stock) {
    var vm = this;

    vm.authentication = Authentication;
    vm.stock = stock;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Stock
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.stock.$remove($state.go('stocks.list'));
      }
    }

    // Save Stock
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.stockForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.stock._id) {
        vm.stock.$update(successCallback, errorCallback);
      } else {
        vm.stock.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('stocks.view', {
          stockId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
