(function () {
  'use strict';

  angular
    .module('lineups')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Lineups',
      state: 'lineups',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'lineups', {
      title: 'List Lineups',
      state: 'lineups.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'lineups', {
      title: 'Create Lineup',
      state: 'lineups.create',
      roles: ['user']
    });
  }
})();
