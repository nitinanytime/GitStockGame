(function () {
  'use strict';

  // Lineups controller
  angular
    .module('lineups')
    .controller('LineupsController', LineupsController);

  LineupsController.$inject = ['$scope', '$state', 'Authentication', 'lineupResolve','StocksService'];

  function LineupsController ($scope, $state, Authentication, lineup, StocksService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.lineup = lineup;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.stocks = StocksService.query();
    vm.buyStockModel = false;
    vm.sellStockModel = false;
    vm.buyThisStock =buyThisStock;
    vm.sellThisStock = sellThisStock;
    vm.buyStockSave = buyStockSave;
    vm.sellStockSave = sellStockSave;
    vm.calculateLineup_money = calculateLineup_money;

    vm.saveLineup = saveLineup; 

    vm.newStockline = {};
    vm.lineup_money = 0;

    console.log(vm.lineup);
    calculateLineup_money();
     // Save Game
  function buyThisStock(stock){
    vm.newStockline = {};
    console.log(stock);
    var data = vm.lineup.line;

      var newStock = true;
      for(var i = 0; i < data.length; i++){

        if(stock.Symbol == data[i].stock.Symbol){
          vm.old_stock_unit  = data[i].stock_unit;
          vm.newStockline.stock = data[i].stock;
          vm.newStockline.stock_unit = data[i].stock_unit;
          vm.sellStockModel = !vm.sellStockModel;
          newStock = false;
        }
      }
      if(newStock){
          vm.newStockline.stock= stock;
          vm.newStockline.stock_unit = 1;
          vm.buyStockModel = !vm.buyStockModel;

      }
    }

    function buyStockSave(){
      vm.lineup.line.push(vm.newStockline);
      vm.buyStockModel = !vm.buyStockModel;
    }

    function sellThisStock(stock){
    vm.newStockline = {};
    console.log(stock);
    var data = vm.lineup.line;
      for(var i = 0; i < data.length; i++){

        if(stock.Symbol == data[i].stock.Symbol){
          vm.newStockline.stock = data[i].stock;
          vm.old_stock_unit  = data[i].stock_unit;
          vm.newStockline.stock_unit = data[i].stock_unit;
          vm.newStockline.checked = data[i].checked;
          vm.sellStockModel = !vm.sellStockModel;
        }
      }
    }
  

    function sellStockSave(){
      var data = vm.lineup.line;
      for(var i = 0; i < data.length; i++){
        if(vm.newStockline.stock.Symbol == data[i].stock.Symbol){
          vm.lineup.line.splice(i,1);
          vm.lineup.line.push(vm.newStockline);
        }
      }
      vm.sellStockModel = !vm.sellStockModel;
    }


    function saveLineup(){
      console.log(vm.lineup);
      vm.lineup.$update(null, null);
    }


    function calculateLineup_money(){
      var data = vm.lineup.line;
      var result = 0;
      if(data === undefined){return result;}
      for(var i = 0; i < data.length; i++){
        if(data[i].stock_unit == 0){
          vm.lineup.line.splice(i,1);
        }
        result = result + (data[i].stock.Last*data[i].stock_unit);
      }
      vm.lineup_money =result;
      vm.lineup.total_money = vm.lineup_money;
      return result;
    }

    // Remove existing Lineup
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.lineup.$remove($state.go('lineups.list'));
      }
    }

    // Save Lineup
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.lineupForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.lineup._id) {
        vm.lineup.$update(successCallback, errorCallback);
      } else {
        vm.lineup.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('lineups.view', {
          lineupId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
