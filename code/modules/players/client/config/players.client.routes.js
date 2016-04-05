(function () {
  'use strict';

  angular
    .module('players')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('players', {
        abstract: true,
        url: '/players',
        template: '<ui-view/>'
      })
      .state('players.list', {
        url: '',
        templateUrl: 'modules/players/client/views/list-players.client.view.html',
        controller: 'PlayersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Players List'
        }
      })
      .state('players.create', {
        url: '/create',
        templateUrl: 'modules/players/client/views/form-player.client.view.html',
        controller: 'PlayersController',
        controllerAs: 'vm',
        resolve: {
          playerResolve: newPlayer
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Players Create'
        }
      })
      .state('players.edit', {
        url: '/:playerId/edit',
        templateUrl: 'modules/players/client/views/form-player.client.view.html',
        controller: 'PlayersController',
        controllerAs: 'vm',
        resolve: {
          playerResolve: getPlayer
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Player {{ playerResolve.name }}'
        }
      })
      .state('players.view', {
        url: '/:playerId',
        templateUrl: 'modules/players/client/views/view-player.client.view.html',
        controller: 'PlayersController',
        controllerAs: 'vm',
        resolve: {
          playerResolve: getPlayer
        },
        data:{
          pageTitle: 'Player {{ articleResolve.name }}'
        }
      });
  }

  getPlayer.$inject = ['$stateParams', 'PlayersService'];

  function getPlayer($stateParams, PlayersService) {
    return PlayersService.get({
      playerId: $stateParams.playerId
    }).$promise;
  }

  newPlayer.$inject = ['PlayersService'];

  function newPlayer(PlayersService) {
    return new PlayersService();
  }
})();
