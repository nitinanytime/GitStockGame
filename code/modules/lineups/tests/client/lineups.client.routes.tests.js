(function () {
  'use strict';

  describe('Lineups Route Tests', function () {
    // Initialize global variables
    var $scope,
      LineupsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _LineupsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      LineupsService = _LineupsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('lineups');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/lineups');
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
          LineupsController,
          mockLineup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('lineups.view');
          $templateCache.put('modules/lineups/client/views/view-lineup.client.view.html', '');

          // create mock Lineup
          mockLineup = new LineupsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Lineup Name'
          });

          //Initialize Controller
          LineupsController = $controller('LineupsController as vm', {
            $scope: $scope,
            lineupResolve: mockLineup
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:lineupId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.lineupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            lineupId: 1
          })).toEqual('/lineups/1');
        }));

        it('should attach an Lineup to the controller scope', function () {
          expect($scope.vm.lineup._id).toBe(mockLineup._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/lineups/client/views/view-lineup.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          LineupsController,
          mockLineup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('lineups.create');
          $templateCache.put('modules/lineups/client/views/form-lineup.client.view.html', '');

          // create mock Lineup
          mockLineup = new LineupsService();

          //Initialize Controller
          LineupsController = $controller('LineupsController as vm', {
            $scope: $scope,
            lineupResolve: mockLineup
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.lineupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/lineups/create');
        }));

        it('should attach an Lineup to the controller scope', function () {
          expect($scope.vm.lineup._id).toBe(mockLineup._id);
          expect($scope.vm.lineup._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/lineups/client/views/form-lineup.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          LineupsController,
          mockLineup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('lineups.edit');
          $templateCache.put('modules/lineups/client/views/form-lineup.client.view.html', '');

          // create mock Lineup
          mockLineup = new LineupsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Lineup Name'
          });

          //Initialize Controller
          LineupsController = $controller('LineupsController as vm', {
            $scope: $scope,
            lineupResolve: mockLineup
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:lineupId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.lineupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            lineupId: 1
          })).toEqual('/lineups/1/edit');
        }));

        it('should attach an Lineup to the controller scope', function () {
          expect($scope.vm.lineup._id).toBe(mockLineup._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/lineups/client/views/form-lineup.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
