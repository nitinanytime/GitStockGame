(function () {
  'use strict';

  describe('Playermoves Route Tests', function () {
    // Initialize global variables
    var $scope,
      PlayermovesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PlayermovesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PlayermovesService = _PlayermovesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('playermoves');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/playermoves');
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
          PlayermovesController,
          mockPlayermove;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('playermoves.view');
          $templateCache.put('modules/playermoves/client/views/view-playermove.client.view.html', '');

          // create mock Playermove
          mockPlayermove = new PlayermovesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Playermove Name'
          });

          //Initialize Controller
          PlayermovesController = $controller('PlayermovesController as vm', {
            $scope: $scope,
            playermoveResolve: mockPlayermove
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:playermoveId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.playermoveResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            playermoveId: 1
          })).toEqual('/playermoves/1');
        }));

        it('should attach an Playermove to the controller scope', function () {
          expect($scope.vm.playermove._id).toBe(mockPlayermove._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/playermoves/client/views/view-playermove.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PlayermovesController,
          mockPlayermove;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('playermoves.create');
          $templateCache.put('modules/playermoves/client/views/form-playermove.client.view.html', '');

          // create mock Playermove
          mockPlayermove = new PlayermovesService();

          //Initialize Controller
          PlayermovesController = $controller('PlayermovesController as vm', {
            $scope: $scope,
            playermoveResolve: mockPlayermove
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.playermoveResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/playermoves/create');
        }));

        it('should attach an Playermove to the controller scope', function () {
          expect($scope.vm.playermove._id).toBe(mockPlayermove._id);
          expect($scope.vm.playermove._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/playermoves/client/views/form-playermove.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PlayermovesController,
          mockPlayermove;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('playermoves.edit');
          $templateCache.put('modules/playermoves/client/views/form-playermove.client.view.html', '');

          // create mock Playermove
          mockPlayermove = new PlayermovesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Playermove Name'
          });

          //Initialize Controller
          PlayermovesController = $controller('PlayermovesController as vm', {
            $scope: $scope,
            playermoveResolve: mockPlayermove
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:playermoveId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.playermoveResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            playermoveId: 1
          })).toEqual('/playermoves/1/edit');
        }));

        it('should attach an Playermove to the controller scope', function () {
          expect($scope.vm.playermove._id).toBe(mockPlayermove._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/playermoves/client/views/form-playermove.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
