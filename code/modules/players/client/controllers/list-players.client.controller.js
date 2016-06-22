(function () {
  'use strict';

  angular
    .module('players')
    .controller('PlayersListController', PlayersListController);

  PlayersListController.$inject = ['$http', 'PlayersService'];

  function PlayersListController($http, PlayersService) {
    var vm = this;
    vm.rankUsers =[];

    vm.players = PlayersService.query();

    getTopPlayers();

     function getTopPlayers() {
 
            $http.get('/api/users/ranklist').success(function (response) {
                vm.rankUsers = response;
                console.log('came');
                console.log(vm.rankUsers);
 
            }).error(function (response) {
                vm.error = response.message;
            });
        };

  }
})();
