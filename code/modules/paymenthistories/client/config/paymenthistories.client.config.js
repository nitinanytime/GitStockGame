(function () {
  'use strict';

  angular
    .module('paymenthistories')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Paymenthistories',
      state: 'paymenthistories',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'paymenthistories', {
      title: 'List Paymenthistories',
      state: 'paymenthistories.list',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'paymenthistories', {
      title: 'Add Payment',
      state: 'paymenthistories.create',
      roles: ['user']
    });

    // Add the dropdown withdraw item
    Menus.addSubMenuItem('topbar', 'paymenthistories', {
      title: 'Withdraw Payment',
      state: 'paymenthistories.withdraw',
      roles: ['user']
    });
  }
})();
