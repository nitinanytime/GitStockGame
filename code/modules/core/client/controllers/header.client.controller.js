'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'PlayersService', 'Authentication', 'NotificationsService', 'Menus',
  function ($scope, $state, PlayersService, Authentication, NotificationsService, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;
    $scope.games = [];
    $scope.notifications = [];
    $scope.notification = new NotificationsService();

    $scope.readNotification = readNotification;
    
    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    angular.element(document.querySelector('.page-container')).addClass('sidebar-collapsed').removeClass('sidebar-collapsed-back');
    angular.element(document.querySelector('#menu span')).css({ 'position':'absolute' });


    // Get the account menu
    $scope.accountMenu = Menus.getMenu('account').items[0];

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    getNotifications();

    function readNotification(){
      console.log("read all");
      for(var i = 0; i < $scope.notifications.length; i++){

      $scope.notification = $scope.notifications[i];

      if($scope.notification.active === false){
        $scope.notification.active = true;
        console.log("read all save");
        $scope.notification.$update(null, null);
      }


      }
    }


    function getNotifications(){
      NotificationsService.query({
    }, function (data) {
      // body...
      
      $scope.notifications = data;
      
    });
    }
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);
