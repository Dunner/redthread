'use strict';

/**
 * @ngdoc directive
 * @name redthread.directive:moduleAdmin
 * @description
 * # moduleAdmin
 */
angular.module('redthread')
  .directive('moduleHelper', function (Helper, $timeout) {
    return {
      restrict: 'EA',
      scocpe: true,
      link: function ($scope, $element) {
        
        var id = 0;
        $scope.messages = [];
        
        function newHelper(message) {
          message.id = id++;
          $scope.messages.push(message);
          $timeout(function(){hideHelper(message);}, 6000);
          $timeout(function(){showHelper(message);}, 300);
        }
        
        function showHelper(message) {
          var elementWidth = angular.element($element[0].children[message.id])[0].clientWidth;
          angular.element($element[0].children[message.id]).css({
            'background': message.color,
            'margin-left': '-' + elementWidth - 10 + 'px',
          });
        }
        
        function hideHelper(message) {
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
          if (Object.keys(newValue).length > 1) {
            newHelper(newValue);
          }
        });
      }
    };
  });