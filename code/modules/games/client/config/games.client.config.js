(function () {
  'use strict';

  angular
    .module('games')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Games',
      state: 'games',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'games', {
      title: 'My Games',
      state: 'games.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'games', {
      title: 'Create Game',
      state: 'games.create',
      roles: ['user']
    });
  }
})();
