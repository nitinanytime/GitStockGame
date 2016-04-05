(function () {
  'use strict';

  angular
    .module('playermoves')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('playermoves', {
        abstract: true,
        url: '/playermoves',
        template: '<ui-view/>'
      })
      .state('playermoves.list', {
        url: '',
        templateUrl: 'modules/playermoves/client/views/list-playermoves.client.view.html',
        controller: 'PlayermovesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Playermoves List'
        }
      })
      .state('playermoves.create', {
        url: '/create',
        templateUrl: 'modules/playermoves/client/views/form-playermove.client.view.html',
        controller: 'PlayermovesController',
        controllerAs: 'vm',
        resolve: {
          playermoveResolve: newPlayermove
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Playermoves Create'
        }
      })
      .state('playermoves.edit', {
        url: '/:playermoveId/edit',
        templateUrl: 'modules/playermoves/client/views/form-playermove.client.view.html',
        controller: 'PlayermovesController',
        controllerAs: 'vm',
        resolve: {
          playermoveResolve: getPlayermove
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Playermove {{ playermoveResolve.name }}'
        }
      })
      .state('playermoves.view', {
        url: '/:playermoveId',
        templateUrl: 'modules/playermoves/client/views/view-playermove.client.view.html',
        controller: 'PlayermovesController',
        controllerAs: 'vm',
        resolve: {
          playermoveResolve: getPlayermove
        },
        data:{
          pageTitle: 'Playermove {{ articleResolve.name }}'
        }
      });
  }

  getPlayermove.$inject = ['$stateParams', 'PlayermovesService'];

  function getPlayermove($stateParams, PlayermovesService) {
    return PlayermovesService.get({
      playermoveId: $stateParams.playermoveId
    }).$promise;
  }

  newPlayermove.$inject = ['PlayermovesService'];

  function newPlayermove(PlayermovesService) {
    return new PlayermovesService();
  }
})();
