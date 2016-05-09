(function () {
  'use strict';

  angular
    .module('games')
    .controller('GamesListController', GamesListController);

  GamesListController.$inject = ['GamesService','Authentication','PlayersService'];

  function GamesListController(GamesService, Authentication, PlayersService) {
    var vm = this;
    vm.status = null;
    vm.authentication = Authentication;
    vm.games = [];

    vm.filterStatus = function(games) {
    var result = [];
    for(var i = 0; i < games.length; i++){
    	if(vm.status == null || vm.status === games[i].game_status){
        result.push(games[i]);
    }
      }
    return result;
}

vm.filterMyCreation = function(games) {
    var result = [];
    for(var i = 0; i < games.length; i++){
    	if(games[i].user._id == vm.authentication.user._id){
        result.push(games[i]);
    }
      }
    return result;
}
	console.log(vm.authentication.user.username);
    PlayersService.query({
      player_username: vm.authentication.user.username
    }, function (data) {
      // body...
      console.log(data);
      vm.players = data;
      console.log(vm.players);
      for(var i = 0; i < vm.players.length; i++){
    	vm.games.push(vm.players[i].game); 
}
      
    });


  }
})();
