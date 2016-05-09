(function () {
  'use strict';

  angular
    .module('paymenthistories')
    .controller('AdminWithdrawListController', AdminWithdrawListController);

  AdminWithdrawListController.$inject = ['PaymenthistoriesService', 'Authentication'];

  function AdminWithdrawListController(PaymenthistoriesService, Authentication) {
    var vm = this;
    vm.status = null;
    vm.authentication = Authentication;
    vm.paymenthistories =[];

    vm.filterStatus = function(paymenthistories) {
    var result = [];
    for(var i = 0; i < paymenthistories.length; i++){
      if(vm.status == null || vm.status === paymenthistories[i].status){
        result.push(paymenthistories[i]);
    }
      }
    return result;
}


    PaymenthistoriesService.query({
      type: 'debit',
      status: 'Requested'
    }, function (data) {
      // body...
      vm.paymenthistories = data;
      
    });
  }                                                         
})();
