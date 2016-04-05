(function () {
  'use strict';

  describe('Players Route Tests', function () {
    // Initialize global variables
    var $scope,
      PlayersService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PlayersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PlayersService = _PlayersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('players');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/players');
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
          PlayersController,
          mockPlayer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('players.view');
          $templateCache.put('modules/players/client/views/view-player.client.view.html', '');

          // create mock Player
          mockPlayer = new PlayersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Player Name'
          });

          //Initialize Controller
          PlayersController = $controller('PlayersController as vm', {
            $scope: $scope,
            playerResolve: mockPlayer
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:playerId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.playerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            playerId: 1
          })).toEqual('/players/1');
        }));

        it('should attach an Player to the controller scope', function () {
          expect($scope.vm.player._id).toBe(mockPlayer._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/players/client/views/view-player.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PlayersController,
          mockPlayer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('players.create');
          $templateCache.put('modules/players/client/views/form-player.client.view.html', '');

          // create mock Player
          mockPlayer = new PlayersService();

          //Initialize Controller
          PlayersController = $controller('PlayersController as vm', {
            $scope: $scope,
            playerResolve: mockPlayer
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.playerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/players/create');
        }));

        it('should attach an Player to the controller scope', function () {
          expect($scope.vm.player._id).toBe(mockPlayer._id);
          expect($scope.vm.player._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/players/client/views/form-player.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PlayersController,
          mockPlayer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('players.edit');
          $templateCache.put('modules/players/client/views/form-player.client.view.html', '');

          // create mock Player
          mockPlayer = new PlayersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Player Name'
          });

          //Initialize Controller
          PlayersController = $controller('PlayersController as vm', {
            $scope: $scope,
            playerResolve: mockPlayer
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:playerId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.playerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            playerId: 1
          })).toEqual('/players/1/edit');
        }));

        it('should attach an Player to the controller scope', function () {
          expect($scope.vm.player._id).toBe(mockPlayer._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/players/client/views/form-player.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
