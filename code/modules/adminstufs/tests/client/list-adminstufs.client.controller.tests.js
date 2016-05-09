(function () {
  'use strict';

  describe('Adminstufs List Controller Tests', function () {
    // Initialize global variables
    var AdminstufsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      AdminstufsService,
      mockAdminstuf;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _AdminstufsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      AdminstufsService = _AdminstufsService_;

      // create mock article
      mockAdminstuf = new AdminstufsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Adminstuf Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Adminstufs List controller.
      AdminstufsListController = $controller('AdminstufsListController as vm', {
        $scope: $scope
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockAdminstufList;

      beforeEach(function () {
        mockAdminstufList = [mockAdminstuf, mockAdminstuf];
      });

      it('should send a GET request and return all Adminstufs', inject(function (AdminstufsService) {
        // Set POST response
        $httpBackend.expectGET('api/adminstufs').respond(mockAdminstufList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.adminstufs.length).toEqual(2);
        expect($scope.vm.adminstufs[0]).toEqual(mockAdminstuf);
        expect($scope.vm.adminstufs[1]).toEqual(mockAdminstuf);

      }));
    });
  });
})();
