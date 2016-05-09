(function () {
  'use strict';

  // Paymenthistories controller
  angular
    .module('paymenthistories')
    .controller('PaymenthistoriesController', PaymenthistoriesController);

  PaymenthistoriesController.$inject = ['$scope', '$window', '$state', 'Authentication', 'paymenthistoryResolve'];

  function PaymenthistoriesController ($scope, $window, $state, Authentication, paymenthistory) {
    var vm = this;

    vm.authentication = Authentication;
    vm.paymenthistory = paymenthistory;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.paynow = false;
    vm.creditCard = false;
    vm.credit_card = {};


  $scope.paymentMethod = function() {
   if(vm.paymenthistory.payment_method === 'credit_card'){
    vm.creditCard = true;
   }else{
    vm.creditCard = false;
   }
  };

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
        vm.paymenthistory.creditCard = vm.credit_card;
        vm.paymenthistory.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        console.log(res);
        vm.paynow = !vm.paynow ;
        if(vm.paymenthistory.payment_method === 'paypal'){
        vm.message = res.message;
        vm.payUrl = res.redirectUrl;
        }else{
          vm.message = res.message;
        vm.payUrl = res.redirectUrl;
        }
        
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
