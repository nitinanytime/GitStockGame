(function () {
  'use strict';

  describe('Adminstufs Route Tests', function () {
    // Initialize global variables
    var $scope,
      AdminstufsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AdminstufsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AdminstufsService = _AdminstufsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('adminstufs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/adminstufs');
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
          AdminstufsController,
          mockAdminstuf;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('adminstufs.view');
          $templateCache.put('modules/adminstufs/client/views/view-adminstuf.client.view.html', '');

          // create mock Adminstuf
          mockAdminstuf = new AdminstufsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Adminstuf Name'
          });

          //Initialize Controller
          AdminstufsController = $controller('AdminstufsController as vm', {
            $scope: $scope,
            adminstufResolve: mockAdminstuf
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:adminstufId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.adminstufResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            adminstufId: 1
          })).toEqual('/adminstufs/1');
        }));

        it('should attach an Adminstuf to the controller scope', function () {
          expect($scope.vm.adminstuf._id).toBe(mockAdminstuf._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/adminstufs/client/views/view-adminstuf.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AdminstufsController,
          mockAdminstuf;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('adminstufs.create');
          $templateCache.put('modules/adminstufs/client/views/form-adminstuf.client.view.html', '');

          // create mock Adminstuf
          mockAdminstuf = new AdminstufsService();

          //Initialize Controller
          AdminstufsController = $controller('AdminstufsController as vm', {
            $scope: $scope,
            adminstufResolve: mockAdminstuf
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.adminstufResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/adminstufs/create');
        }));

        it('should attach an Adminstuf to the controller scope', function () {
          expect($scope.vm.adminstuf._id).toBe(mockAdminstuf._id);
          expect($scope.vm.adminstuf._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/adminstufs/client/views/form-adminstuf.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AdminstufsController,
          mockAdminstuf;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('adminstufs.edit');
          $templateCache.put('modules/adminstufs/client/views/form-adminstuf.client.view.html', '');

          // create mock Adminstuf
          mockAdminstuf = new AdminstufsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Adminstuf Name'
          });

          //Initialize Controller
          AdminstufsController = $controller('AdminstufsController as vm', {
            $scope: $scope,
            adminstufResolve: mockAdminstuf
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:adminstufId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.adminstufResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            adminstufId: 1
          })).toEqual('/adminstufs/1/edit');
        }));

        it('should attach an Adminstuf to the controller scope', function () {
          expect($scope.vm.adminstuf._id).toBe(mockAdminstuf._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/adminstufs/client/views/form-adminstuf.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
