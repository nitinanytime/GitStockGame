(function () {
  'use strict';

  describe('Stocks Route Tests', function () {
    // Initialize global variables
    var $scope,
      StocksService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _StocksService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      StocksService = _StocksService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('stocks');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/stocks');
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
          StocksController,
          mockStock;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('stocks.view');
          $templateCache.put('modules/stocks/client/views/view-stock.client.view.html', '');

          // create mock Stock
          mockStock = new StocksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Stock Name'
          });

          //Initialize Controller
          StocksController = $controller('StocksController as vm', {
            $scope: $scope,
            stockResolve: mockStock
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:stockId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.stockResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            stockId: 1
          })).toEqual('/stocks/1');
        }));

        it('should attach an Stock to the controller scope', function () {
          expect($scope.vm.stock._id).toBe(mockStock._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/stocks/client/views/view-stock.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          StocksController,
          mockStock;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('stocks.create');
          $templateCache.put('modules/stocks/client/views/form-stock.client.view.html', '');

          // create mock Stock
          mockStock = new StocksService();

          //Initialize Controller
          StocksController = $controller('StocksController as vm', {
            $scope: $scope,
            stockResolve: mockStock
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.stockResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/stocks/create');
        }));

        it('should attach an Stock to the controller scope', function () {
          expect($scope.vm.stock._id).toBe(mockStock._id);
          expect($scope.vm.stock._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/stocks/client/views/form-stock.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          StocksController,
          mockStock;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('stocks.edit');
          $templateCache.put('modules/stocks/client/views/form-stock.client.view.html', '');

          // create mock Stock
          mockStock = new StocksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Stock Name'
          });

          //Initialize Controller
          StocksController = $controller('StocksController as vm', {
            $scope: $scope,
            stockResolve: mockStock
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:stockId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.stockResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            stockId: 1
          })).toEqual('/stocks/1/edit');
        }));

        it('should attach an Stock to the controller scope', function () {
          expect($scope.vm.stock._id).toBe(mockStock._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/stocks/client/views/form-stock.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
