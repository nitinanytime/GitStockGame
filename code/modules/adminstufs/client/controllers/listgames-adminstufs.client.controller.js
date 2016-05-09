(function () {
  'use strict';

  angular
    .module('adminstufs')
    .controller('AdminGamesListController', AdminGamesListController);

  AdminGamesListController.$inject = ['$scope', '$http', 'AdminstufsService', 'Authentication', 'GamesService'];

  function AdminGamesListController($scope, $http, AdminstufsService, Authentication, GamesService) {
    var vm = this;
    vm.type = null;
    vm.status = null;
    vm.games = [];

    
 

    
    vm.adminstufs = AdminstufsService.query();

    vm.filterStatus = function(games) {
    var result = [];
    for(var i = 0; i < games.length; i++){
      if(vm.status == null || vm.status === games[i].game_status){
        result.push(games[i]);
    }
      }
    return result;
  }



  //Pagination
    vm.totalItems = 15;
    vm.currentPage = 1;


    vm.setPage = function (pageNo) {
        vm.currentPage = pageNo;
    };
 
    vm.pageChanged = function () {
        vm.getGames();
    };

    vm.getGames = function () {
 
            $http.get('/api/games/page/' + vm.currentPage).success(function (response) {
                vm.games = response;
                console.log('came');
                console.log(vm.games);
 
            }).error(function (response) {
                vm.error = response.message;
            });
        };

  }
})();
