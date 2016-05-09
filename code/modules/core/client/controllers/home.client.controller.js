'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'GamesService',
  function ($scope,  Authentication, GamesService) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    var toggle = true;

    GamesService.query({
      game_status:'Open'
    }, function (data) {
      // body...
      console.log(data);
      $scope.games = data;
      
    });
    
    $scope.slide = function (){
      if (toggle){
        angular.element(document.querySelector('.page-container')).addClass('sidebar-collapsed').removeClass('sidebar-collapsed-back');
        angular.element(document.querySelector('#menu span')).css({ 'position':'absolute' });
      }
	  else {
	    angular.element(document.querySelector('.page-container')).removeClass('sidebar-collapsed').addClass('sidebar-collapsed-back');
	    setTimeout(function() {
	    angular.element(document.querySelector('#menu span')).css({'position':'relative'});
	  	}, 400);
	  }
											
      toggle = !toggle;
   
    };
  }
]);

