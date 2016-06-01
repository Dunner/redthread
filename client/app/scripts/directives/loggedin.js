'use strict';

/**
 * @ngdoc directive
 * @name redthread.directive:ifLoggedin
 * @description
 * # ifLoggedin
 */
angular.module('redthread')
  .directive('ifLoggedin', function (Auth) {

    //Simpelt isolerat direktiv som via dependency injection av AUTH
    //kan visa/dölja element beroende på användarautentisering

    return {
      restrict: 'EA',
      scope: true,
      link: function (scope, element) {
        
        scope.auth = Auth;
        scope.$watch('auth.getStatus()', function(newValue) {
          if (newValue) {
            element.removeClass('ng-hide');
            element.addClass('ng-show');
          } else {
            element.removeClass('ng-show');
            element.addClass('ng-hide');
          }
        });
        
      }
    };
  });