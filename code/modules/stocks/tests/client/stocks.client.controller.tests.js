(function () {
  'use strict';

  describe('Stocks Controller Tests', function () {
    // Initialize global variables
    var StocksController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      StocksService,
      mockStock;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _StocksService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      StocksService = _StocksService_;

      // create mock Stock
      mockStock = new StocksService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Stock Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Stocks controller.
      StocksController = $controller('StocksController as vm', {
        $scope: $scope,
        stockResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleStockPostData;

      beforeEach(function () {
        // Create a sample Stock object
        sampleStockPostData = new StocksService({
          name: 'Stock Name'
        });

        $scope.vm.stock = sampleStockPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (StocksService) {
        // Set POST response
        $httpBackend.expectPOST('api/stocks', sampleStockPostData).respond(mockStock);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Stock was created
        expect($state.go).toHaveBeenCalledWith('stocks.view', {
          stockId: mockStock._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/stocks', sampleStockPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Stock in $scope
        $scope.vm.stock = mockStock;
      });

      it('should update a valid Stock', inject(function (StocksService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/stocks\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('stocks.view', {
          stockId: mockStock._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (StocksService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/stocks\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Stocks
        $scope.vm.stock = mockStock;
      });

      it('should delete the Stock and redirect to Stocks', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/stocks\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('stocks.list');
      });

      it('should should not delete the Stock and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
