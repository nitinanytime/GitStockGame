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


    vm.reverseRound = reverseRound;
    vm.reverseMoney = 0;
 
    vm.portfolio_value = vm.lineup.max_money;
    vm.balance_value= 0;
    vm.running_value = 0;

    vm.saveLineup = saveLineup; 

    vm.newStockline = {};
    vm.lineup_money = 0;

    vm.max_money_huddlers = [500000, 1000000];

    console.log(vm.lineup);
    calculateLineup_money();

  function reverseRound(){
            vm.newStockline.stock_unit = Math.floor(vm.reverseMoney / vm.newStockline.stock.Last);
            if((vm.newStockline.stock_unit * vm.newStockline.stock.Last)>vm.reverseMoney){
                vm.newStockline.stock_unit = vm.newStockline.stock_unit -1;

            }

            if((vm.newStockline.stock_unit * vm.newStockline.stock.Last)>(1000000/4)){
                vm.newStockline.stock_unit = Math.floor((1000000/4) / vm.newStockline.stock.Last);
            }
        }
     // Save Game
  function buyThisStock(stock){
    vm.newStockline = {};
    console.log(stock);
    vm.reverseMoney = null;
    var data = vm.lineup.line;

      var newStock = true;
      for(var i = 0; i < data.length; i++){

        if(stock.Symbol == data[i].stock.Symbol){
          vm.old_stock_unit  = data[i].stock_unit;
          vm.newStockline.stock = data[i].stock;
          vm.newStockline.stock_unit = data[i].stock_unit;
          vm.newStockline.checked = data[i].checked;
          vm.sellStockModel = !vm.sellStockModel;
          newStock = false;
        }
      }
      if(newStock){
          vm.newStockline.stock= stock;
          vm.newStockline.stock_unit = 1;
          vm.newStockline.checked = true;
          vm.buyStockModel = !vm.buyStockModel;

      }
    }

    function buyStockSave(){
      var remain_balance = (vm.balance_value) + ((vm.newStockline.stock.Last) * (vm.old_stock_unit - vm.newStockline.stock_unit));
            if (remain_balance < 0) {
                alert("Balance required");
                return false;
            }

            var stock_money = vm.newStockline.stock_unit * vm.newStockline.stock.Last;
            if (stock_money > 1000000 / 4) {
                alert("You cant buy same share with more than 25% of fantacy money");
                return false;
            }
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
      var remain_balance = (vm.balance_value) + ((vm.newStockline.stock.Last) * (vm.old_stock_unit - vm.newStockline.stock_unit));
            if (remain_balance < 0) {
                alert("Balance required");
                return false;
            }

            var stock_money = vm.newStockline.stock_unit * vm.newStockline.stock.Last;
            if (stock_money > 1000000 / 4) {
                alert("You cant buy same share with more than 25% of fantacy money");
                return false;
            }
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
      
      vm.running_value = vm.lineup_money;
      vm.balance_value= vm.portfolio_value - vm.running_value ;
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
