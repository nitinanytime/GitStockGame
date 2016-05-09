(function () {
  'use strict';

  angular
    .module('adminstufs')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Adminstufs',
      state: 'adminstufs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'adminstufs', {
      title: 'List Adminstufs',
      state: 'adminstufs.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'adminstufs', {
      title: 'Create Adminstuf',
      state: 'adminstufs.create',
      roles: ['user']
    });

    //List Games
    Menus.addSubMenuItem('topbar', 'adminstufs', {
      title: 'List Games',
      state: 'adminstufs.games'
    });

    //List Withdraw Request
    Menus.addSubMenuItem('topbar', 'adminstufs', {
      title: 'List withdrawal',
      state: 'adminstufs.withdrawal'
    });


  }
})();
