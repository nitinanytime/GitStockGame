(function () {
  'use strict';

  angular
    .module('playermoves')
    .controller('PlayermovesListController', PlayermovesListController);

  PlayermovesListController.$inject = ['PlayermovesService'];

  function PlayermovesListController(PlayermovesService) {
    var vm = this;

    vm.playermoves = PlayermovesService.query();
  }
})();
