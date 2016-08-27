(function() {
    'use strict';

    // Games controller
    angular
        .module('games')
        .controller('GamesController', GamesController);

    GamesController.$inject = ['$scope', '$state', 'Users', 'Authentication', 'gameResolve', 'playerResolve', 'playermoveResolve', 'StocksService', 'PlayersService', 'PlayermovesService', 'LineupsService', 'AdminstufsService'];


    function GamesController($scope, $state, Users, Authentication, game, player, playermove, StocksService, PlayersService, PlayermovesService, LineupsService, AdminstufsService) {
        var vm = this;
        vm.Math = window.Math;
        vm.authentication = Authentication;
        
        vm.joingameModal = false;
        vm.gameModal = false;
        vm.game = game;
        vm.game.game_prize = (vm.game.game_minPlayer*vm.game.game_EntryFee)-(((vm.game.game_minPlayer*vm.game.game_EntryFee)*10)/100);
        vm.player = player;
        vm.myRank = 0;
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        vm.joinGame = joinGame;
        vm.stocks = StocksService.query();
        vm.reverseMoney = 0;
        vm.buyStockModel = false;
        vm.sellStockModel = false;
        vm.reverseRound = reverseRound;
        vm.buyThisStock = buyThisStock;
        vm.sellThisStock = sellThisStock;
        vm.buyStockSave = buyStockSave;
        vm.sellStockSave = sellStockSave;
        vm.playermove = playermove;
        vm.getWinnerRule = getWinnerRule;
        vm.addPayout = false;
        vm.game_EntryFees = [1, 2, 3, 4, 5, 10, 15, 20, 25, 50, 75, 100, 200, 500, 1000];
        vm.game_minPlayers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25, 30, 35, 40, 45, 50, 75, 100];


        vm.getPlayerLineup = getPlayerLineup;
        vm.playerLineupModel = false;
        vm.importLineup = importLineup;

        vm.otherPlayerPortfolioModel = false;
        vm.getPlayerPortfolio = getPlayerPortfolio;

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


            var todaydate = new Date();
            var time = todaydate.getHours(); 
            console.log(time);
            if (time < 9) {
                todaydate.setDate(todaydate.getDate() - 1);
                $scope.todaydate = todaydate.toString();
            }else{
                $scope.todaydate = todaydate.toString();
            }





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

        function reverseRound(){
            vm.playermove.stock_unit = Math.floor(vm.reverseMoney / vm.playermove.stock.Last);
            if((vm.playermove.stock_unit * vm.playermove.stock.Last)>vm.reverseMoney){
                vm.playermove.stock_unit = vm.playermove.stock_unit -1;

            }

            if((vm.playermove.stock_unit * vm.playermove.stock.Last)>(vm.game.game_money/4)){
                vm.playermove.stock_unit = Math.floor((vm.game.game_money/4) / vm.playermove.stock.Last);
            }
        }

        // Remove existing Game
        function remove() {
            if (confirm('Are you sure you want to delete?')) {
                vm.game.$remove($state.go('games.list', {}, {reload: true}));
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
                vm.balance_value= 0;
                vm.running_value = 0;
                vm.portfolio_value = 0;

                for (var i = 0; i < data.length; i++) {

                    vm.portfolio_value = vm.portfolio_value + (data[i].stock_unit * data[i].stock.Last);

                }
                if(vm.game.game_status==='Open'){
                    vm.balance_value=  vm.game.game_money - vm.portfolio_value;
                

                    vm.running_value = vm.game.game_money;

                }
                else{
                    vm.balance_value=  vm.player.player_holdMoney;
                

                vm.running_value = vm.portfolio_value + parseFloat(vm.balance_value);
                }
                
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

        

        function getPlayerPortfolio(playername) {
            vm.otherPlayerPortfolioModel =false;
            PlayersService.query({
            game: vm.game._id,
            player_username: playername
        }, function(data) {
            // body...
            var player = data[0];
            console.log(player);
            vm.otherPlayer = player;
              PlayermovesService.query({
                player: player._id
            }, function(result) {
                console.log(result);
               vm.otherPlayerPortfolioModel = !vm.otherPlayerPortfolioModel;
               vm.otherPlayerPortfolio = result;

            });

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
            

             if(vm.game.game_EntryFee > vm.authentication.user.user_balance){
                alert("Please Add Money to create/Join the game");
                return false;
            }

            console.log(vm.player);
            vm.player = new PlayersService();
            vm.player.player_username = vm.authentication.user.username;
            vm.player.player_name = vm.authentication.user.displayName;
            vm.player.game = game._id;
            vm.player.$save(successCallback, errorCallback);

            function successCallback(res) {
                
                //vm.joingameModal = !vm.joingameModal;
                vm.players.push(vm.player);
                updateGame();
               
            }

            function updateGame() {
                vm.game.game_player = vm.game.game_player + 1;
                console.log('Game reduce');
                console.log(vm.game.game_player);
                 $state.go('games.view', {
                    gameId: game._id
                },{reload: true});
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
            if(!vm.player._id){
                var r = confirm("Want to join the game?");
                if (r == true) {
                    joinGame(vm.game);
                } else {
                    return;
                }
            }
            vm.reverseMoney = null;
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
                    vm.playermove.checked = true;
                    vm.old_stock_unit = 0;
                    vm.buyStockModel = !vm.buyStockModel;

                }
            });

        }

        function buyStockSave() {
            console.log(vm.playermove);
            var remain_balance = (vm.balance_value) + ((vm.playermove.stock.Last) * (vm.old_stock_unit - vm.playermove.stock_unit));
            if (remain_balance < 0) {
                alert("Balance required");
                return false;
            }

            var stock_money = vm.playermove.stock_unit * vm.playermove.stock.Last;
            if (stock_money > vm.game.game_money / 4) {
                alert("You cant buy same share with more than 25% of fantacy money");
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
                vm.balance_value = remain_balance;
                vm.player.player_holdMoney = remain_balance;
                vm.player.$update(successCallback, errorCallback);
            }

            function successCallback(res) {
                vm.buyStockModel = !vm.buyStockModel;
                getPlayerMoves(null);
                // $state.reload();
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

            var remain_balance = (vm.balance_value) + ((vm.playermove.stock.Last) * (vm.old_stock_unit - vm.playermove.stock_unit));
            if (remain_balance < 0) {
                alert("Balance required");
                return false;
            }

            if (vm.playermove.stock.Last < 5 && (vm.old_stock_unit - vm.playermove.stock_unit)<0) {
                alert("Sorry! Yoou can't buy more stocks pricing less than $5");
                return false;
            }

            var stock_money = vm.playermove.stock_unit * vm.playermove.stock.Last;
            if (stock_money > vm.game.game_money / 4) {
                alert("You cant buy same share with more than 25% of fantacy money");
                return false;
            }

            if(vm.playermove.stock_unit <= 0 ){
                vm.playermove.$delete(null, null);
                vm.sellStockModel = !vm.sellStockModel;
                getPlayerMoves(null);
                return false;
            }
            console.log(vm.playermove);
            vm.playermove.stock_price = vm.playermove.stock.Last;
            vm.playermove.total_money = vm.playermove.stock_unit * vm.playermove.stock.Last;
            console.log(vm.playermove);
            vm.playermove.$update(null, null);

            updatePlayer();

            function updatePlayer() {
                vm.balance_value = remain_balance;
                vm.player.player_holdMoney = remain_balance;
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

            if(vm.game.game_EntryFee > vm.authentication.user.user_balance && vm.addPayout === false){
                alert("Please Add Money to create the game");
                return false;
            }
            console.log(vm.game);
            vm.game.game_prize = 0;
            vm.game.game_startTime = new Date(vm.game.game_startTime);
            vm.game.game_endTime = new Date(vm.game.game_endTime);
            vm.game.game_payOut = $scope.payout;
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.gameForm');
                return false;
            }

            // TODO: move create/update logic to service
            if (vm.game._id) {
                vm.game.$update(successCallback, errorCallback);
            } else {

                vm.game.$save(successJoingame, errorCallback);
            }

            function successCallback(res) {
                $state.go('games.view', {
                    gameId: res._id
                },{reload: true});
            }
            function successJoingame(res) {
                if(vm.addPayout === false){
                    joinGame(res);
                }
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
