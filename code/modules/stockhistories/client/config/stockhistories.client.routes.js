(function () {
  'use strict';

  angular
    .module('stockhistories')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('stockhistories', {
        abstract: true,
        url: '/stockhistories',
        template: '<ui-view/>'
      })
      .state('stockhistories.list', {
        url: '',
        templateUrl: 'modules/stockhistories/client/views/list-stockhistories.client.view.html',
        controller: 'StockhistoriesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Stockhistories List'
        }
      })
      .state('stockhistories.create', {
        url: '/create',
        templateUrl: 'modules/stockhistories/client/views/form-stockhistory.client.view.html',
        controller: 'StockhistoriesController',
        controllerAs: 'vm',
        resolve: {
          stockhistoryResolve: newStockhistory
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Stockhistories Create'
        }
      })
      .state('stockhistories.edit', {
        url: '/:stockhistoryId/edit',
        templateUrl: 'modules/stockhistories/client/views/form-stockhistory.client.view.html',
        controller: 'StockhistoriesController',
        controllerAs: 'vm',
        resolve: {
          stockhistoryResolve: getStockhistory
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Stockhistory {{ stockhistoryResolve.name }}'
        }
      })
      .state('stockhistories.view', {
        url: '/:stockhistoryId',
        templateUrl: 'modules/stockhistories/client/views/view-stockhistory.client.view.html',
        controller: 'StockhistoriesController',
        controllerAs: 'vm',
        resolve: {
          stockhistoryResolve: getStockhistory
        },
        data:{
          pageTitle: 'Stockhistory {{ articleResolve.name }}'
        }
      });
  }

  getStockhistory.$inject = ['$stateParams', 'StockhistoriesService'];

  function getStockhistory($stateParams, StockhistoriesService) {
    return StockhistoriesService.get({
      stockhistoryId: $stateParams.stockhistoryId
    }).$promise;
  }

  newStockhistory.$inject = ['StockhistoriesService'];

  function newStockhistory(StockhistoriesService) {
    return new StockhistoriesService();
  }
})();
