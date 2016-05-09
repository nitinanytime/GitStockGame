(function () {
  'use strict';

  angular
    .module('lineups')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('lineups', {
        abstract: true,
        url: '/lineups',
        template: '<ui-view/>'
      })
      .state('lineups.list', {
        url: '',
        templateUrl: 'modules/lineups/client/views/list-lineups.client.view.html',
        controller: 'LineupsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Lineups List'
        }
      })
      .state('lineups.create', {
        url: '/create',
        templateUrl: 'modules/lineups/client/views/form-lineup.client.view.html',
        controller: 'LineupsController',
        controllerAs: 'vm',
        resolve: {
          lineupResolve: newLineup
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Lineups Create'
        }
      })
      .state('lineups.edit', {
        url: '/:lineupId/edit',
        templateUrl: 'modules/lineups/client/views/form-lineup.client.view.html',
        controller: 'LineupsController',
        controllerAs: 'vm',
        resolve: {
          lineupResolve: getLineup
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Lineup {{ lineupResolve.name }}'
        }
      })
      .state('lineups.view', {
        url: '/:lineupId',
        templateUrl: 'modules/lineups/client/views/view-lineup.client.view.html',
        controller: 'LineupsController',
        controllerAs: 'vm',
        resolve: {
          lineupResolve: getLineup
        },
        data:{
          pageTitle: 'Lineup {{ articleResolve.name }}'
        }
      });
  }

  getLineup.$inject = ['$stateParams', 'LineupsService'];

  function getLineup($stateParams, LineupsService) {
    return LineupsService.get({
      lineupId: $stateParams.lineupId
    }).$promise;
  }

  newLineup.$inject = ['LineupsService'];

  function newLineup(LineupsService) {
    return new LineupsService();
  }
})();
