(function () {
  'use strict';

  angular
    .module('stocks')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('stocks', {
        abstract: true,
        url: '/stocks',
        template: '<ui-view/>'
      })
      .state('stocks.list', {
        url: '',
        templateUrl: 'modules/stocks/client/views/list-stocks.client.view.html',
        controller: 'StocksListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Stocks List'
        }
      })
      .state('stocks.create', {
        url: '/create',
        templateUrl: 'modules/stocks/client/views/form-stock.client.view.html',
        controller: 'StocksController',
        controllerAs: 'vm',
        resolve: {
          stockResolve: newStock
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Stocks Create'
        }
      })
      .state('stocks.edit', {
        url: '/:stockId/edit',
        templateUrl: 'modules/stocks/client/views/form-stock.client.view.html',
        controller: 'StocksController',
        controllerAs: 'vm',
        resolve: {
          stockResolve: getStock
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Stock {{ stockResolve.name }}'
        }
      })
      .state('stocks.view', {
        url: '/:stockId',
        templateUrl: 'modules/stocks/client/views/view-stock.client.view.html',
        controller: 'StocksController',
        controllerAs: 'vm',
        resolve: {
          stockResolve: getStock
        },
        data:{
          pageTitle: 'Stock {{ articleResolve.name }}'
        }
      });
  }

  getStock.$inject = ['$stateParams', 'StocksService'];

  function getStock($stateParams, StocksService) {
    return StocksService.get({
      stockId: $stateParams.stockId
    }).$promise;
  }

  newStock.$inject = ['StocksService'];

  function newStock(StocksService) {
    return new StocksService();
  }
})();
