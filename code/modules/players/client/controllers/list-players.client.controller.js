(function () {
  'use strict';

  angular
    .module('players')
    .controller('PlayersListController', PlayersListController);

  PlayersListController.$inject = ['PlayersService'];

  function PlayersListController(PlayersService) {
    var vm = this;

    vm.players = PlayersService.query();
  }
})();
