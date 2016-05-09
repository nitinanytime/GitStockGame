(function () {
  'use strict';

  angular
    .module('stocks')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Stocks',
      state: 'stocks',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'stocks', {
      title: 'List Stocks',
      state: 'stocks.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'stocks', {
      title: 'Create Stock',
      state: 'stocks.create',
      roles: ['admin']
    });
  }
})();
