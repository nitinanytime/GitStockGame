(function () {
  'use strict';

  angular
    .module('notifications')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('notifications', {
        abstract: true,
        url: '/notifications',
        template: '<ui-view/>'
      })
      .state('notifications.list', {
        url: '',
        templateUrl: 'modules/notifications/client/views/list-notifications.client.view.html',
        controller: 'NotificationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Notifications List'
        }
      })
      .state('notifications.create', {
        url: '/create',
        templateUrl: 'modules/notifications/client/views/form-notification.client.view.html',
        controller: 'NotificationsController',
        controllerAs: 'vm',
        resolve: {
          notificationResolve: newNotification
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Notifications Create'
        }
      })
      .state('notifications.edit', {
        url: '/:notificationId/edit',
        templateUrl: 'modules/notifications/client/views/form-notification.client.view.html',
        controller: 'NotificationsController',
        controllerAs: 'vm',
        resolve: {
          notificationResolve: getNotification
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Notification {{ notificationResolve.name }}'
        }
      })
      .state('notifications.view', {
        url: '/:notificationId',
        templateUrl: 'modules/notifications/client/views/view-notification.client.view.html',
        controller: 'NotificationsController',
        controllerAs: 'vm',
        resolve: {
          notificationResolve: getNotification
        },
        data:{
          pageTitle: 'Notification {{ articleResolve.name }}'
        }
      });
  }

  getNotification.$inject = ['$stateParams', 'NotificationsService'];

  function getNotification($stateParams, NotificationsService) {
    return NotificationsService.get({
      notificationId: $stateParams.notificationId
    }).$promise;
  }

  newNotification.$inject = ['NotificationsService'];

  function newNotification(NotificationsService) {
    return new NotificationsService();
  }
})();
