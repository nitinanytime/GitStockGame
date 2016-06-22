(function () {
  'use strict';

  angular
    .module('stockhistories')
    .controller('StockhistoriesListController', StockhistoriesListController);

  StockhistoriesListController.$inject = ['StockhistoriesService'];

  function StockhistoriesListController(StockhistoriesService) {
    var vm = this;
    vm.sortType     = 'null';
    vm.stockhistories = null;

    vm.filterDate = new Date();
    vm.filterHistory = filterHistory;




    function filterHistory(){
      alert('hi');
    StockhistoriesService.query({
      created: vm.filterDate
    }, function (data) {
      
      vm.stockhistories = data;
      console.log(data);
    });
    }

  }
})();
