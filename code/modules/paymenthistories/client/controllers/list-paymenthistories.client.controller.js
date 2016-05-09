(function () {
  'use strict';

  angular
    .module('paymenthistories')
    .controller('PaymenthistoriesListController', PaymenthistoriesListController);

  PaymenthistoriesListController.$inject = ['$http', 'PaymenthistoriesService', 'Authentication'];

  function PaymenthistoriesListController($http, PaymenthistoriesService, Authentication) {
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
      username: vm.authentication.user.username
    }, function (data) {
      // body...
      vm.paymenthistories = data;
      
    });


    //Pagination
    vm.totalItems = 15;
    vm.currentPage = 1;


    vm.setPage = function (pageNo) {
        vm.currentPage = pageNo;
    };
 
    vm.pageChanged = function () {
        vm.getPaymenthistories();
    };

    vm.getPaymenthistories = function () {
      var username = vm.authentication.user.username;
            $http.get('/api/paymenthistories/page/' + vm.currentPage+ '?username='+ username).success(function (response) {
                vm.paymenthistories = response;
                console.log('came');
                console.log(vm.paymenthistories);
 
            }).error(function (response) {
                vm.error = response.message;
            });
        };
  }																													
})();
