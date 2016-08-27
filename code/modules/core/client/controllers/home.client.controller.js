'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'GamesService','PlayersService',
  function ($scope,  Authentication, GamesService, PlayersService) {
    // This provides Authentication context.

    var vm = this;
    vm.gameModal = false;
    $scope.authentication = Authentication;

    var toggle = false;

    angular.element(document.querySelector('.page-container')).addClass('sidebar-collapsed').removeClass('sidebar-collapsed-back');
        angular.element(document.querySelector('#menu span')).css({ 'position':'absolute' });

    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.active = 0;
    var currIndex = 0;
    var slides = $scope.slides = [];
    slides.push({
      image: 'http://www.stockmarketgame.org/img/layerslider/Students-Hero1.jpg',
      text: ['Nice image','Awesome photograph','That is so cool','I love that'][slides.length % 4],
      id: currIndex++

    });
    slides.push({
      image: 'http://education.howthemarketworks.com/wp-content/uploads/2015/08/translogosmallnewcolor.png',
      text: ['Nice image','Awesome photograph','That is so cool','I love that'][slides.length % 4],
      id: currIndex++
    });
    

  $scope.init = function(){

    GamesService.query({
      game_status:'Open'
    }, function (data) {
      // body...
      console.log(data);
      $scope.games = data;
      $scope.games.sort(comp);
      $scope.nextlive = $scope.games[0].game_startTime;
    });
  }

  $scope.getGame = function(game){
    console.log("fdsfd");
      
   
      vm.game = game;
      vm.game.game_prize = (vm.game.game_minPlayer*vm.game.game_EntryFee)-(((vm.game.game_minPlayer*vm.game.game_EntryFee)*10)/100);
      
      
     PlayersService.query({
            game: game._id
        }, function(data) {
            // body...
            console.log(data);
            vm.players = data;
            vm.gameModal =!vm.gameModal;
        });
     

  }

var timeinterval = setInterval(function(){ 
  var t = Date.parse($scope.nextlive) - Date.parse(new Date());
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000/60) % 60 );
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
  var result = days + ':' +hours +':'+ minutes +':'+ seconds;
  $scope.nextliveValue = result;
  $scope.$apply();
 },1000);

$scope.timer  = function (endtime){
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000/60) % 60 );
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
  var result = days + ':' +hours +':'+ minutes +':'+ seconds;
  return result;
}


    function comp(a, b) {
    return  new Date(b.game_startTime).getTime() - new Date(a.game_startTime).getTime() ;
  }
    
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

