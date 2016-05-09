(function () {
  'use strict';

  describe('Paymenthistories Route Tests', function () {
    // Initialize global variables
    var $scope,
      PaymenthistoriesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PaymenthistoriesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PaymenthistoriesService = _PaymenthistoriesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('paymenthistories');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/paymenthistories');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          PaymenthistoriesController,
          mockPaymenthistory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('paymenthistories.view');
          $templateCache.put('modules/paymenthistories/client/views/view-paymenthistory.client.view.html', '');

          // create mock Paymenthistory
          mockPaymenthistory = new PaymenthistoriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Paymenthistory Name'
          });

          //Initialize Controller
          PaymenthistoriesController = $controller('PaymenthistoriesController as vm', {
            $scope: $scope,
            paymenthistoryResolve: mockPaymenthistory
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:paymenthistoryId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.paymenthistoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            paymenthistoryId: 1
          })).toEqual('/paymenthistories/1');
        }));

        it('should attach an Paymenthistory to the controller scope', function () {
          expect($scope.vm.paymenthistory._id).toBe(mockPaymenthistory._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/paymenthistories/client/views/view-paymenthistory.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PaymenthistoriesController,
          mockPaymenthistory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('paymenthistories.create');
          $templateCache.put('modules/paymenthistories/client/views/form-paymenthistory.client.view.html', '');

          // create mock Paymenthistory
          mockPaymenthistory = new PaymenthistoriesService();

          //Initialize Controller
          PaymenthistoriesController = $controller('PaymenthistoriesController as vm', {
            $scope: $scope,
            paymenthistoryResolve: mockPaymenthistory
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.paymenthistoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/paymenthistories/create');
        }));

        it('should attach an Paymenthistory to the controller scope', function () {
          expect($scope.vm.paymenthistory._id).toBe(mockPaymenthistory._id);
          expect($scope.vm.paymenthistory._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/paymenthistories/client/views/form-paymenthistory.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PaymenthistoriesController,
          mockPaymenthistory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('paymenthistories.edit');
          $templateCache.put('modules/paymenthistories/client/views/form-paymenthistory.client.view.html', '');

          // create mock Paymenthistory
          mockPaymenthistory = new PaymenthistoriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Paymenthistory Name'
          });

          //Initialize Controller
          PaymenthistoriesController = $controller('PaymenthistoriesController as vm', {
            $scope: $scope,
            paymenthistoryResolve: mockPaymenthistory
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:paymenthistoryId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.paymenthistoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            paymenthistoryId: 1
          })).toEqual('/paymenthistories/1/edit');
        }));

        it('should attach an Paymenthistory to the controller scope', function () {
          expect($scope.vm.paymenthistory._id).toBe(mockPaymenthistory._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/paymenthistories/client/views/form-paymenthistory.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
