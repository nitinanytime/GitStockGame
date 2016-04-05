(function () {
  'use strict';

  // Games controller
  angular
    .module('games')
    .controller('GamesController', GamesController);

  GamesController.$inject = ['$scope', '$state', 'Authentication', 'gameResolve', 'playerResolve', 'playermoveResolve', 'StocksService', 'PlayersService', 'PlayermovesService'];


  function GamesController ($scope, $state, Authentication, game, player, playermove, StocksService, PlayersService, PlayermovesService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.joingameModal = false;
    vm.game = game;
    vm.player = player;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.joinGame =joinGame;
    vm.stocks = StocksService.query();
    vm.buyStockModel = false;
    vm.buyThisStock =buyThisStock;
    vm.buyStockSave = buyStockSave;
    vm.playermove= playermove;
    vm.getPlayerMoves = getPlayerMoves;

    vm.playerStockModel = false;
    vm.playerMoveModel=false;
    

    alert(vm.game._id);
    console.log(game.game_startTime);
    
    PlayersService.query({
      game: vm.game._id
    }, function (data) {
      // body...
      console.log(data);
      vm.players = data;
      console.log(vm.players);
      for(var i = 0; i < vm.players.length; i++){
        if(vm.players[i].player_username===vm.authentication.user.username){
          console.log('match');
          vm.player = vm.players[i];
        }
        console.log(vm.player);
      }
      
    });

    

    
    // Remove existing Game
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.game.$remove($state.go('games.list'));
      }
    }


  function getPlayerMoves(view_type) {
      console.log(view_type);
       PlayermovesService.query({
      player: vm.player._id
    }, function (data) {
      // body...
      console.log(data);
      vm.playerStocks = [];

      for(var i = 0; i < data.length; i++){
        var symbol = data [i].stock.Symbol;
        var count = 0;
        for(var j = 0; j < data.length; j++){
          if(symbol === data[j].stock.Symbol){
            if(data[j].type === 'BUY'){
              console.log(data[j].stock_unit);
            count = count + data[j].stock_unit;
          }
            else{
              count = count - data[j].stock_unit;
            }

          }

        }
        vm.playerStocks.push({'Symbol':symbol,'Count':count});
      }

      console.log(vm.playerStocks);

      if(view_type === 'playerStockModel'){
         vm.playerStockModel = !vm.playerStockModel;
      }
        if(view_type === 'playerMoveModel'){
          vm.playerAllMoves = data;
          vm.playerMoveModel = !vm.playerMoveModel;
        }
      
      
      
    });
    }


    // Save Game
  function joinGame(game){
    alert('yes');

    console.log(vm.player);
    vm.player.player_username =  vm.authentication.user.username;
    vm.player.player_name =  vm.authentication.user.displayName;
    vm.player.game = game._id;
    vm.player.player_money =vm.game.game_money;
    vm.player.$save(successCallback,errorCallback);

    function successCallback(res) {
        $state.go('games.view', {
          gameId: game._id
        });
        vm.joingameModal = !vm.joingameModal;
        vm.players.push(vm.player);
        updateGame();
      }

      function updateGame(){
        vm.game.game_player = vm.game.game_player + 1 ;
        console.log('Game reduce');
        console.log(vm.game.game_player);
      //  vm.game.$update(null,null); 
      }
      function errorCallback(res) {
        vm.error = res.data.message;
        alert(res.data.message);
      }

    }


    // Save Game
  function buyThisStock(stock){
    console.log(stock);
    vm.playermove.stock = stock;
    vm.playermove.game = vm.game._id;
    vm.playermove.stock_unit = 1;

    vm.buyStockModel = !vm.buyStockModel;

    }

    function buyStockSave(){
      console.log(vm.playermove);
      
      vm.playermove.stock_price = vm.playermove.stock.Last;
      vm.playermove.type = 'BUY';
      vm.playermove.total_money = vm.playermove.stock_unit * vm.playermove.stock.Last;
      vm.playermove.player = vm.player._id;
      vm.playermove.stock = vm.playermove.stock._id;

      vm.playermove.$save(successCallback, errorCallback);

      updatePlayer();
      function updatePlayer(){
        vm.player.player_money = vm.player.player_money - vm.playermove.total_money;
        vm.player.$update(successCallback, errorCallback);
      }
      function successCallback(res) {
        vm.buyStockModel = !vm.buyStockModel;
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        console.log(vm.error);
      }

    }

    function doNothing(){
        
      }


    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.gameForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.game._id) {
        vm.game.$update(successCallback, errorCallback);
      } else {
        vm.game.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('games.view', {
          gameId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
