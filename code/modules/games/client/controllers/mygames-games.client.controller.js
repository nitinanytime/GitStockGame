(function () {
  'use strict';

  // Games controller
  angular
    .module('games')
    .controller('MyGamesController', MyGamesController);

  MyGamesController.$inject = ['$scope', '$state', 'Authentication', 'GamesService', 'StocksService', 'PlayersService', 'PlayermovesService'];


  function MyGamesController ($scope, $state, Authentication, GamesService, StocksService, PlayersService, PlayermovesService) {
    var vm = this;

    vm.authentication = Authentication;
    //vm.games = GamesService.query();

    

    
    PlayersService.query({
      user: vm.authentication.user._id
    }, function (data) {
      // body...
      console.log(data);
      vm.players = data;
      console.log(vm.players);
      
      
    });

    

    
  }
})();
