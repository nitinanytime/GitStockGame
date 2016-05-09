(function () {
  'use strict';

  angular
    .module('paymenthistories')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('paymenthistories', {
        abstract: true,
        url: '/paymenthistories',
        template: '<ui-view/>'
      })
      .state('paymenthistories.list', {
        url: '',
        templateUrl: 'modules/paymenthistories/client/views/list-paymenthistories.client.view.html',
        controller: 'PaymenthistoriesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Paymenthistories List'
        }
      })
      .state('paymenthistories.create', {
        url: '/create',
        templateUrl: 'modules/paymenthistories/client/views/form-paymenthistory.client.view.html',
        controller: 'PaymenthistoriesController',
        controllerAs: 'vm',
        resolve: {
          paymenthistoryResolve: newPaymenthistory
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Paymenthistories Create'
        }
      })
      .state('paymenthistories.withdraw', {
        url: '/withdraw',
        templateUrl: 'modules/paymenthistories/client/views/withdraw-form-paymenthistory.client.view.html',
        controller: 'WithdrawController',
        controllerAs: 'vm',
        resolve: {
          paymenthistoryResolve: newPaymenthistory
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Paymenthistories Withdraw'
        }
      })
      .state('paymenthistories.edit', {
        url: '/:paymenthistoryId/edit',
        templateUrl: 'modules/paymenthistories/client/views/form-paymenthistory.client.view.html',
        controller: 'PaymenthistoriesController',
        controllerAs: 'vm',
        resolve: {
          paymenthistoryResolve: getPaymenthistory
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Paymenthistory {{ paymenthistoryResolve.name }}'
        }
      })
      .state('paymenthistories.view', {
        url: '/:paymenthistoryId',
        templateUrl: 'modules/paymenthistories/client/views/view-paymenthistory.client.view.html',
        controller: 'PaymenthistoriesController',
        controllerAs: 'vm',
        resolve: {
          paymenthistoryResolve: getPaymenthistory
        },
        data:{
          pageTitle: 'Paymenthistory {{ articleResolve.name }}'
        }
      });
  }

  getPaymenthistory.$inject = ['$stateParams', 'PaymenthistoriesService'];

  function getPaymenthistory($stateParams, PaymenthistoriesService) {
    return PaymenthistoriesService.get({
      paymenthistoryId: $stateParams.paymenthistoryId
    }).$promise;
  }

  newPaymenthistory.$inject = ['PaymenthistoriesService'];

  function newPaymenthistory(PaymenthistoriesService) {
    return new PaymenthistoriesService();
  }
})();
