(function() {
    'use strict';

    // Games controller
    angular
        .module('games')
        .controller('GamesController', GamesController);

    GamesController.$inject = ['$scope', '$state', 'Users', 'Authentication', 'gameResolve', 'playerResolve', 'playermoveResolve', 'StocksService', 'PlayersService', 'PlayermovesService', 'LineupsService', 'AdminstufsService'];


    function GamesController($scope, $state, Users, Authentication, game, player, playermove, StocksService, PlayersService, PlayermovesService, LineupsService, AdminstufsService) {
        var vm = this;

        vm.authentication = Authentication;
        $scope.todaydate = new Date().toString();
        vm.joingameModal = false;
        vm.game = game;
        vm.player = player;
        vm.myRank = 0;
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        vm.joinGame = joinGame;
        vm.stocks = StocksService.query();
        vm.buyStockModel = false;
        vm.sellStockModel = false;
        vm.buyThisStock = buyThisStock;
        vm.sellThisStock = sellThisStock;
        vm.buyStockSave = buyStockSave;
        vm.sellStockSave = sellStockSave;
        vm.playermove = playermove;
        vm.getWinnerRule = getWinnerRule;
        vm.addPayout = false;



        vm.getPlayerLineup = getPlayerLineup;
        vm.playerLineupModel = false;
        vm.importLineup = importLineup;

        vm.old_stock_unit = 0;
        vm.remain_balance = 0;

        vm.private = false;
        vm.running_value = 0;
        vm.winningRules = [];

        $scope.demo1 = {
            min: 20,
            max: 80



        };

        // Define $scope.telephone as an array

        vm.RuleTable = false;
        $scope.payout = [];
        // Create a counter to keep track of the additional telephone inputs
        $scope.inputCounter = 0;

        // This is just so you can see the array values changing and working! Check your console as you're typing in the inputs :)
        $scope.$watch('payout', function(value) {
            console.log(value);
        }, true);





        AdminstufsService.query({
            type: 'winning_rule',
            active: true
        }, function(data) {
            // body...
            vm.winningRules = data;
            if (vm.authentication.user.roles.indexOf('admin') > -1) {
                vm.addPayout = true;
                vm.winningRules.push({ key: 'prize_payout', value_1: '2', value_2: 10 });
            }
            console.log('winning rule' + vm.winningRules);

            console.log(vm.winningRules);

        });



        // alert(vm.game._id);
        console.log(game.game_startTime);

        PlayersService.query({
            game: vm.game._id
        }, function(data) {
            // body...
            console.log(data);
            vm.players = data;
            console.log(vm.players);
            for (var i = 0; i < vm.players.length; i++) {
                if (vm.players[i].player_username === vm.authentication.user.username) {
                    console.log('match');
                    vm.player = vm.players[i];
                    getPlayerMoves(null);
                }
                console.log(vm.player);
            }

        });


        $scope.privateGame = function() {
            if (vm.game.game_type === 'private') {
                vm.private = true;
            } else {
                vm.private = false;
            }
        };

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
            }, function(data) {
                // body...
                console.log(data);
                vm.playerStocks = data;
                vm.player.player_money = vm.game.game_money;
                for (var i = 0; i < data.length; i++) {

                    vm.player.player_money = vm.player.player_money - (data[i].stock_unit * data[i].stock.Last);

                }
                console.log('value' + vm.game.game_money + parseFloat(vm.player.player_money).toFixed(2));
                vm.running_value = vm.game.game_money - parseFloat(vm.player.player_money).toFixed(2);
                /* vm.playerStocks = [];
     var stockSymbol = [];
      for(var i = 0; i < data.length; i++){
        var symbol = data [i].stock.Symbol;
        var count = 0;
        var money = 0;
        console.log(stockSymbol.indexOf(symbol));
        if (stockSymbol.indexOf(symbol)<0) {
          for(var j = 0; j < data.length; j++){
          if(symbol === data[j].stock.Symbol){
            if(data[j].type === 'BUY'){
              console.log(data[j].stock_unit);
            count = count + data[j].stock_unit;
            money = money + data[j].total_money;
          }
            else{
              count = count - data[j].stock_unit;
              money = money - data[j].total_money;
            }

          }

        }
        vm.playerStocks.push({'Symbol':symbol,'Count':count, 'Money':money});
        stockSymbol.push(symbol);
        };
        
        
      }

      console.log(vm.playerStocks);

      if(view_type === 'playerStockModel'){
         vm.playerStockModel = !vm.playerStockModel;
      }
        if(view_type === 'playerMoveModel'){
          vm.playerAllMoves = data;
          vm.playerMoveModel = !vm.playerMoveModel;
        }
      
      */

            });
        }

        function getWinnerRule(size) {
            var result = [];
            var data = vm.winningRules;
            for (var i = 0; i < data.length; i++) {
                if (parseInt(data[i].value_1) <= size) {
                    result.push(data[i]);
                }
            }



            return result;

        }


        function getPlayerLineup() {
            LineupsService.query({
                user: vm.authentication.user._id
            }, function(data) {
                // body...
                console.log(data);
                vm.lineups = data;
                vm.playerLineupModel = !vm.playerLineupModel;

            });
        }

        function importLineup(lineup) {

            console.log(lineup);
            PlayermovesService.query({
                player: vm.player._id
            }, function(data) {
                for (var i = 0; i < data.length; i++) {

                    vm.playermove = data[i];
                    vm.playermove.$delete(null, null);

                }
                var newplayermove = playermove;
                for (var j = 0; j < lineup.line.length; j++) {

                    vm.playermove = new PlayermovesService();
                    vm.playermove.stock_price = lineup.line[j].stock.Last;
                    vm.playermove.type = 'BUY';
                    vm.playermove.stock_unit = lineup.line[j].stock_unit;
                    vm.playermove.total_money = lineup.line[j].stock_unit * lineup.line[j].stock.Last;
                    vm.playermove.player = vm.player._id;
                    vm.playermove.stock = lineup.line[j].stock._id;
                    vm.playermove.checked = lineup.line[j].checked;

                    vm.playermove.$save(null, null);
                    console.log(lineup.line.length);
                    console.log(j);
                    if (lineup.line.length == j + 1) {
                        getPlayerMoves();
                        vm.playerLineupModel = !vm.playerLineupModel;

                    }

                }
            });

        }



        // Save Game
        function joinGame(game) {
            alert('yes');

            console.log(vm.player);
            vm.player.player_username = vm.authentication.user.username;
            vm.player.player_name = vm.authentication.user.displayName;
            vm.player.game = game._id;
            vm.player.player_money = vm.game.game_money;
            vm.player.$save(successCallback, errorCallback);

            function successCallback(res) {
                $state.go('games.view', {
                    gameId: game._id
                });
                vm.joingameModal = !vm.joingameModal;
                vm.players.push(vm.player);
                updateGame();
            }

            function updateGame() {
                vm.game.game_player = vm.game.game_player + 1;
                console.log('Game reduce');
                console.log(vm.game.game_player);
                //  vm.game.$update(null,null); 
                //vm.authentication.user.user_balance = vm.authentication.user.user_balance - vm.game.game_EntryFee;
                //updateUser(vm.authentication.user)
            }

            function updateUser(userObject) {
                var user = new Users(userObject);

                user.$update(null, null);
            }


            function errorCallback(res) {
                vm.error = res.data.message;
                alert(res.data.message);
            }

        }


        // Save Game
        function buyThisStock(stock) {
            console.log(stock);
            PlayermovesService.query({
                player: vm.player._id
            }, function(data) {

                var newStock = true;
                for (var i = 0; i < data.length; i++) {

                    if (stock.Symbol == data[i].stock.Symbol) {
                        vm.playermove = data[i];
                        vm.old_stock_unit = data[i].stock_unit;
                        vm.sellStockModel = !vm.sellStockModel;
                        newStock = false;
                    }
                }
                if (newStock) {
                    vm.playermove = new PlayermovesService();
                    vm.playermove.stock = stock;
                    vm.playermove.game = vm.game._id;
                    vm.playermove.stock_unit = 1;
                    vm.old_stock_unit = vm.playermove.stock_unit;
                    vm.buyStockModel = !vm.buyStockModel;

                }
            });

        }

        function buyStockSave() {
            console.log(vm.playermove);
            var remain_balance = (vm.player.player_money) + ((vm.playermove.stock.Last) * (vm.old_stock_unit - vm.playermove.stock_unit));
            if (remain_balance < 0) {
                alert("Balance required");
                return false;
            }
            vm.playermove.stock_price = vm.playermove.stock.Last;
            vm.playermove.type = 'BUY';
            vm.playermove.total_money = vm.playermove.stock_unit * vm.playermove.stock.Last;
            vm.playermove.player = vm.player._id;
            vm.playermove.stock = vm.playermove.stock._id;

            vm.playermove.$save(null, null);

            updatePlayer();

            function updatePlayer() {
                vm.player.player_money = remain_balance;
                vm.player.$update(successCallback, errorCallback);
            }

            function successCallback(res) {
                vm.buyStockModel = !vm.buyStockModel;
                getPlayerMoves(null);
            }

            function errorCallback(res) {
                vm.error = res.data.message;
                console.log(vm.error);
            }

        }

        function sellThisStock(stock) {
            console.log(stock);
            PlayermovesService.query({
                player: vm.player._id
            }, function(data) {
                for (var i = 0; i < data.length; i++) {

                    if (stock.Symbol == data[i].stock.Symbol) {
                        vm.playermove = data[i];

                        vm.old_stock_unit = data[i].stock_unit;
                        vm.sellStockModel = !vm.sellStockModel;
                    }
                }
            });

            // 

        }

        function sellStockSave() {

            var remain_balance = (vm.player.player_money) + ((vm.playermove.stock.Last) * (vm.old_stock_unit - vm.playermove.stock_unit));
            if (remain_balance < 0) {
                alert("Balance required");
                return false;
            }
            console.log(vm.playermove);
            vm.playermove.stock_price = vm.playermove.stock.Last;
            vm.playermove.total_money = vm.playermove.stock_unit * vm.playermove.stock.Last;
            console.log(vm.playermove);
            vm.playermove.$update(null, null);

            updatePlayer();

            function updatePlayer() {
                vm.player.player_money = remain_balance;
                vm.player.$update(successCallback, errorCallback);
            }

            function successCallback(res) {
                vm.sellStockModel = !vm.sellStockModel;
                getPlayerMoves(null);
            }

            function errorCallback(res) {
                vm.error = res.data.message;
                console.log(vm.error);
            }

        }



        function save(isValid) {

            console.log(vm.game);
            vm.game.game_startTime = new Date(vm.game.game_startTime);
            vm.game.game_endTime = new Date(vm.game.game_endTime);
            vm.game_payOut = $scope.payout;
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


        var disableDays = function(minDate, maxDate) {
            var startDate = minDate;
            var monthsAhead = 6;
            // '31' is the maximum days in a month, we want not less 
            var endDate = maxDate;
            var days = $scope.datesDisabled;

            for (var iDate = new Date(startDate); iDate < endDate; iDate.setDate(iDate.getDate() + 1)) {
                // months are zero indexed so + 1
                var date = new Date((iDate.getMonth() + 1) + '/' + iDate.getDate() + '/' + iDate.getFullYear());

                // Disable weekend
                if ((iDate.getDay() == 0) || (iDate.getDay() == 6)) {
                    days.push(date.getTime());
                }


            }
            return days;
        }



        $scope.disableDates = function() {
            // Apply disabled days
            var minD = new Date();
            var maxD = new Date();
            var maxD = new Date(maxD.setYear(minD.getFullYear() + 1));
            
            AdminstufsService.query({
                type: 'disable_date',
                active: true
            }, function(data) {
                // body...

                var disable_date = data[0].value_1;
                var dates = disable_date.split(',');
                $scope.datesDisabled = [];
                for (var i = 0; i < dates.length; i++) {
                    var timestamp = new Date(dates[i]);
                    $scope.datesDisabled.push(new Date(dates[i]).getTime());

                }

                $scope.datesDisabled = disableDays(minD, maxD);
                console.log("Its Done");

            });

        };





    }
})();
