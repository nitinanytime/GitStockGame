(function () {
  'use strict';

  angular
    .module('adminstufs')
    .controller('AdminstufsListController', AdminstufsListController);

  AdminstufsListController.$inject = ['AdminstufsService'];

  function AdminstufsListController(AdminstufsService) {
    var vm = this;
    vm.type = null;

    vm.adminstufs = AdminstufsService.query();

    vm.filterType = function(adminstufs) {
    var result = [];
    for(var i = 0; i < adminstufs.length; i++){
      if(vm.type == null || vm.type === adminstufs[i].type){
        result.push(adminstufs[i]);
    }
      }
    return result;
}

  }
})();
