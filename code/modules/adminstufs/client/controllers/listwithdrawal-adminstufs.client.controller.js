(function () {
  'use strict';

  angular
    .module('paymenthistories')
    .controller('AdminWithdrawListController', AdminWithdrawListController);

  AdminWithdrawListController.$inject = ['PaymenthistoriesService', '$http',  'Authentication', 'paymenthistoryResolve'];

  function AdminWithdrawListController(PaymenthistoriesService, $http,  Authentication, paymenthistory) {
    var vm = this;
    vm.status = null;
    vm.authentication = Authentication;
    vm.paymenthistories =[];

    vm.paymenthistory = paymenthistory;

    vm.getUserPayments = getUserPayments;

    vm.paymentList = paymentList;
    vm.actionPayment = actionPayment;
    vm.actionPaymentSave = actionPaymentSave;

    vm.response = [];

    vm.csvHeader=['payout_batch_id',
                                'paymenthistory_id',
                                'payout_item_id',
                                'transaction_status',
                                'amount',
                                'paypal_fee',
                                'note',
                                'receiver',
                                'Remark',
                                'Status'];


    vm.userPaymentsModal = false;
    vm.userPayments = null;
    vm.userPaymentObj = null;
    vm.lastAmount =0;
    vm.paymentActionModal = false;

    vm.filterStatus = function(paymenthistories) {
    var result = [];
    for(var i = 0; i < paymenthistories.length; i++){
      if(vm.status == null || vm.status === paymenthistories[i].status){
        result.push(paymenthistories[i]);
    }
      }
    return result;
}

    paymentList('REQUESTED');

    function paymentList(status){
        PaymenthistoriesService.query({
      type: 'debit',
      status: status
    }, function (data) {
      // body...
      vm.paymenthistories = data;
      
    });

    }


    

    function getUserPayments(username){
        PaymenthistoriesService.query({
         username: username
        }, function (data) {
        // body...
        vm.userPayments = data;
        vm.userPaymentsModal = !vm.userPaymentsModal;
      
    });

    }

    function actionPayment(paymenthistory){
        vm.userPaymentObj = paymenthistory;
        vm.lastAmount = paymenthistory.amount;
        vm.paymentActionModal = !vm.paymentActionModal;

    }

    function actionPaymentSave(){
        console.log("gjghjhg");
        vm.paymenthistory = vm.userPaymentObj;
        vm.paymenthistory.$update(null, null);
        vm.paymentActionModal = !vm.paymentActionModal;

    }



    vm.payBulk = function () {
 
            $http.get('/api/sendPayoutBulk').success(function (response) {
                var data = response.Success;
                var payout_batch_id = data.batch_header.payout_batch_id
                var items = data.items;
                for(var i =0 ; i<items.length; i++){
                  var payout = {payout_batch_id: payout_batch_id,
                                paymenthistory_id: items[i].payout_item.sender_item_id,
                                payout_item_id: items[i].payout_item_id,
                                transaction_status: items[i].transaction_status,
                                amount:items[i].payout_item.amount.value,
                                paypal_fee:items[i].payout_item_fee.value,
                                note:items[i].payout_item.note,
                                receiver:items[i].payout_item.receiver};

                  
                  vm.response.push(payout); 
                }
                console.log(vm.response);
 
            }).error(function (response) {
              vm.response = response;
                vm.error = response.message;
            });
        };

    


  }                                                         
})();
