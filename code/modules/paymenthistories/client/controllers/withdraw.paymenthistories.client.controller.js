(function () {
  'use strict';

  // Paymenthistories controller
  angular
    .module('paymenthistories')
    .controller('WithdrawController', WithdrawController);

  WithdrawController.$inject = ['$scope', '$window', '$state', 'Authentication', 'paymenthistoryResolve'];

  function WithdrawController ($scope, $window, $state, Authentication, paymenthistory) {
    var vm = this;

    vm.authentication = Authentication;
    vm.paymenthistory = paymenthistory;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.userBalance = vm.authentication.user.userBalance;
    vm.paynow = false;
    vm.creditCard = false;
    vm.credit_card = {};


  

    // Remove existing Paymenthistory
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.paymenthistory.$remove($state.go('paymenthistories.list'));
      }
    }

    // Save Paymenthistory
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.paymenthistoryForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.paymenthistory._id) {
        vm.paymenthistory.$update(successCallback, errorCallback);
      } else {
        vm.paymenthistory.type = 'debit';
        vm.paymenthistory.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        console.log(res);
        vm.paynow = !vm.paynow ;
        vm.message = res.message;
        
        
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
