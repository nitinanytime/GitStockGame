(function () {
  'use strict';

  angular
    .module('games')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('games', {
        abstract: true,
        url: '/games',
        template: '<ui-view/>'
      })
      .state('games.list', {
        url: '',
        templateUrl: 'modules/games/client/views/mygames-games.client.view.html',
        controller: 'GamesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Games List'
        }
      })
      .state('games.create', {
        url: '/create',
        templateUrl: 'modules/games/client/views/form-game.client.view.html',
        controller: 'GamesController',
        controllerAs: 'vm',
        resolve: {
          gameResolve: newGame,
          playerResolve: newPlayer,
          playermoveResolve:newPlayermove
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Games Create'
        }
      })
      .state('games.edit', {
        url: '/:gameId/edit',
        templateUrl: 'modules/games/client/views/form-game.client.view.html',
        controller: 'GamesController',
        controllerAs: 'vm',
        resolve: {
          gameResolve: getGame,
          playerResolve: newPlayer,
          playermoveResolve:newPlayermove
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Game {{ gameResolve.name }}'
        }
      })
      .state('games.view', {
        url: '/:gameId',
        templateUrl: 'modules/games/client/views/view-game.client.view.html',
        controller: 'GamesController',
        controllerAs: 'vm',
        resolve: {
          gameResolve: getGame,
          playerResolve: newPlayer,
          playermoveResolve:newPlayermove
        },
        data:{
          pageTitle: 'Game {{ articleResolve.name }}'
        }
      })
      .state('games.mygames', {
        url: '/mygames',
        templateUrl: 'modules/games/client/views/list-games.client.view.html',
        controller: 'MyGamesController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'My Games'
        }
      });
  }

  getGame.$inject = ['$stateParams', 'GamesService', 'PlayersService', 'PlayermovesService'];

  function getGame($stateParams, GamesService) {
    return GamesService.get({
      gameId: $stateParams.gameId
    }).$promise;
  }

  newGame.$inject = ['GamesService'];

  function newGame(GamesService) {
    return new GamesService();
  }

  function newPlayer(PlayersService) {
    return new PlayersService();
  }

  function newPlayermove(PlayermovesService) {
    return new PlayermovesService();
  }
})();
