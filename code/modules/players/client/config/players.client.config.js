(function () {
  'use strict';

  angular
    .module('players')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Players',
      state: 'players',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'players', {
      title: 'List Players',
      state: 'players.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'players', {
      title: 'Create Player',
      state: 'players.create',
      roles: ['admin']
    });
  }
})();
