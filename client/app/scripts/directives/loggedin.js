'use strict';

/**
 * @ngdoc directive
 * @name redthread.directive:ifLoggedin
 * @description
 * # ifLoggedin
 */
angular.module('redthread')
  .directive('ifLoggedin', function (Auth) {
    return {
      restrict: 'EA',
      scocpe: true,
      link: function ($scope, $element) {
        
        $scope.auth = Auth;
        $scope.$watch('auth.getStatus()', function(newValue) {
          if (newValue) {
            $element.removeClass('ng-hide');
            $element.addClass('ng-show');
          } else {
            $element.removeClass('ng-show');
            $element.addClass('ng-hide');
          }
        });
        
      }
    };
  });