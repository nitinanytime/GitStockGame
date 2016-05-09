(function () {
  'use strict';

  angular
    .module('lineups')
    .controller('LineupsListController', LineupsListController);

  LineupsListController.$inject = ['LineupsService', 'Authentication'];

  function LineupsListController(LineupsService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;

    LineupsService.query({
      user: vm.authentication.user._id
    }, function (data) {
      // body...
      vm.lineups = data;
      
    });


    console.log(vm.lineups);
  }
})();
