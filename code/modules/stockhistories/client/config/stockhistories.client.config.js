(function () {
  'use strict';

  angular
    .module('stockhistories')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    //Menus.addMenuItem('topbar', {
    //  title: 'Stockhistories',
    //  state: 'stockhistories',
    //  type: 'dropdown',
    //  roles: ['admin']
    //});

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'adminstufs', {
      title: 'List Stockhistories',
      state: 'stockhistories.list'
    });

    // Add the dropdown create item
    //Menus.addSubMenuItem('topbar', 'stockhistories', {
    //  title: 'Create Stockhistory',
     // state: 'stockhistories.create',
     // roles: ['user']
    //});
  }
})();
