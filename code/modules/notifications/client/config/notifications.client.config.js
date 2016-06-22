(function () {
  'use strict';

  angular
    .module('notifications')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    /*Menus.addMenuItem('topbar', {
      title: 'Notifications',
      state: 'notifications',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'notifications', {
      title: 'List Notifications',
      state: 'notifications.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'notifications', {
      title: 'Create Notification',
      state: 'notifications.create',
      roles: ['user']
    });*/
  }
})();
