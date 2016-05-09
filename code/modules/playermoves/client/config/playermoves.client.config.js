(function () {
  'use strict';

  angular
    .module('playermoves')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
   /* Menus.addMenuItem('topbar', {
      title: 'Playermoves',
      state: 'playermoves',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'playermoves', {
      title: 'List Playermoves',
      state: 'playermoves.list',
      roles: ['admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'playermoves', {
      title: 'Create Playermove',
      state: 'playermoves.create',
      roles: ['admin']
    });*/
  }
})();
