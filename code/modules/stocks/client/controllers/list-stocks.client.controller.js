(function () {
  'use strict';

  angular
    .module('stocks')
    .controller('StocksListController', StocksListController);

  StocksListController.$inject = ['StocksService'];

  function StocksListController(StocksService) {
    var vm = this;

    vm.stocks = StocksService.query();
  }
})();
