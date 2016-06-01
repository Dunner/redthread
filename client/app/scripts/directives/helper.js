'use strict';

/**
 * @ngdoc directive
 * @name redthread.directive:moduleHelper
 * @description
 * # moduleHelper
 */
angular.module('redthread')
  .directive('moduleHelper', function (Helper, $timeout) {

    //Direktiv som används för att visa användaren meddelanden vid olika händelser(t.ex. login/logout)
    //Utnyttjar Helper service via dependency injection för att hitta nya meddelanden

    return {
      restrict: 'EA',
      scocpe: true,
      link: function ($scope, $element) {
        
        var id = 0;
        $scope.messages = [];
        
        function newHelper(message) {

          //Skapar det nya meddelandet och köar upp när det ska visas och döljas

          message.id = id++;
          $scope.messages.push(message);
          $timeout(function(){hideHelper(message);}, 6000);
          $timeout(function(){showHelper(message);}, 300);
        }
        
        function showHelper(message) {

          //Visar meddelandena

          var elementWidth = angular.element($element[0].children[message.id])[0].clientWidth;
          angular.element($element[0].children[message.id]).css({
            'background': message.color,
            'margin-left': '-' + elementWidth - 10 + 'px',
          });
        }
        
        function hideHelper(message) {

          //Döljer meddelandena och tar bort dem

          angular.element($element[0].children[message.id]).css('margin-left', '0px');
          id--;
          $timeout(function(){
            for(var i = $scope.messages.length - 1; i >= 0; i--) {
              if($scope.messages[i].id === message.id) {
                 $scope.messages.splice(i, 1);
              }
            }
          }, 500);

        }
        
        $scope.helper = Helper;
        $scope.message = Helper.get();
        $scope.$watch('helper.get()', function(newValue) { 

          //Väntar på nya meddelanden att visa

          if (Object.keys(newValue).length > 1) {
            newHelper(newValue);
          }
        });
      }
    };
  });