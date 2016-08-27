(function () {
  'use strict';

  angular
    .module('players')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Top Rankers',
      state: 'players',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'players', {
      title: 'List Top20',
      state: 'players.list',
      roles: ['admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'players', {
      title: 'Create Player',
      state: 'players.create',
      roles: ['admin']
    });
  }
})();
