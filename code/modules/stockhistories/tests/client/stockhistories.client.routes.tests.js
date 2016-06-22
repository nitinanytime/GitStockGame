(function () {
  'use strict';

  describe('Stockhistories Route Tests', function () {
    // Initialize global variables
    var $scope,
      StockhistoriesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _StockhistoriesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      StockhistoriesService = _StockhistoriesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('stockhistories');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/stockhistories');
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
          StockhistoriesController,
          mockStockhistory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('stockhistories.view');
          $templateCache.put('modules/stockhistories/client/views/view-stockhistory.client.view.html', '');

          // create mock Stockhistory
          mockStockhistory = new StockhistoriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Stockhistory Name'
          });

          //Initialize Controller
          StockhistoriesController = $controller('StockhistoriesController as vm', {
            $scope: $scope,
            stockhistoryResolve: mockStockhistory
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:stockhistoryId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.stockhistoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            stockhistoryId: 1
          })).toEqual('/stockhistories/1');
        }));

        it('should attach an Stockhistory to the controller scope', function () {
          expect($scope.vm.stockhistory._id).toBe(mockStockhistory._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/stockhistories/client/views/view-stockhistory.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          StockhistoriesController,
          mockStockhistory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('stockhistories.create');
          $templateCache.put('modules/stockhistories/client/views/form-stockhistory.client.view.html', '');

          // create mock Stockhistory
          mockStockhistory = new StockhistoriesService();

          //Initialize Controller
          StockhistoriesController = $controller('StockhistoriesController as vm', {
            $scope: $scope,
            stockhistoryResolve: mockStockhistory
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.stockhistoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/stockhistories/create');
        }));

        it('should attach an Stockhistory to the controller scope', function () {
          expect($scope.vm.stockhistory._id).toBe(mockStockhistory._id);
          expect($scope.vm.stockhistory._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/stockhistories/client/views/form-stockhistory.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          StockhistoriesController,
          mockStockhistory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('stockhistories.edit');
          $templateCache.put('modules/stockhistories/client/views/form-stockhistory.client.view.html', '');

          // create mock Stockhistory
          mockStockhistory = new StockhistoriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Stockhistory Name'
          });

          //Initialize Controller
          StockhistoriesController = $controller('StockhistoriesController as vm', {
            $scope: $scope,
            stockhistoryResolve: mockStockhistory
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:stockhistoryId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.stockhistoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            stockhistoryId: 1
          })).toEqual('/stockhistories/1/edit');
        }));

        it('should attach an Stockhistory to the controller scope', function () {
          expect($scope.vm.stockhistory._id).toBe(mockStockhistory._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/stockhistories/client/views/form-stockhistory.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
