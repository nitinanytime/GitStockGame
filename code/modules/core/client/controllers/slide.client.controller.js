'use strict';

angular.module('core').controller('SlideController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    var toggle = true;
    
    $scope.slide = function (){
      alert('ds');
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

