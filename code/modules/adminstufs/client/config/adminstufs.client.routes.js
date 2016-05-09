(function () {
  'use strict';

  angular
    .module('adminstufs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('adminstufs', {
        abstract: true,
        url: '/adminstufs',
        template: '<ui-view/>'
      })
      .state('adminstufs.list', {
        url: '',
        templateUrl: 'modules/adminstufs/client/views/list-adminstufs.client.view.html',
        controller: 'AdminstufsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Adminstufs List'
        }
      })
      .state('adminstufs.games', {
        url: '',
        templateUrl: 'modules/adminstufs/client/views/listgames-adminstufs.client.view.html',
        controller: 'AdminGamesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'AdminGames List'
        }
      })
      .state('adminstufs.withdrawal', {
        url: '',
        templateUrl: 'modules/adminstufs/client/views/listwithdrawal-adminstufs.client.view.html',
        controller: 'AdminWithdrawListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Withdrawal List'
        }
      })
      .state('adminstufs.create', {
        url: '/create',
        templateUrl: 'modules/adminstufs/client/views/form-adminstuf.client.view.html',
        controller: 'AdminstufsController',
        controllerAs: 'vm',
        resolve: {
          adminstufResolve: newAdminstuf
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Adminstufs Create'
        }
      })
      .state('adminstufs.edit', {
        url: '/:adminstufId/edit',
        templateUrl: 'modules/adminstufs/client/views/form-adminstuf.client.view.html',
        controller: 'AdminstufsController',
        controllerAs: 'vm',
        resolve: {
          adminstufResolve: getAdminstuf
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Adminstuf {{ adminstufResolve.name }}'
        }
      })
      .state('adminstufs.view', {
        url: '/:adminstufId',
        templateUrl: 'modules/adminstufs/client/views/view-adminstuf.client.view.html',
        controller: 'AdminstufsController',
        controllerAs: 'vm',
        resolve: {
          adminstufResolve: getAdminstuf
        },
        data:{
          pageTitle: 'Adminstuf {{ articleResolve.name }}'
        }
      });
  }

  getAdminstuf.$inject = ['$stateParams', 'AdminstufsService'];

  function getAdminstuf($stateParams, AdminstufsService) {
    return AdminstufsService.get({
      adminstufId: $stateParams.adminstufId
    }).$promise;
  }

  newAdminstuf.$inject = ['AdminstufsService'];

  function newAdminstuf(AdminstufsService) {
    return new AdminstufsService();
  }
})();
