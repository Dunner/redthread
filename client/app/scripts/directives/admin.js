'use strict';

/**
 * @ngdoc directive
 * @name redthread.directive:moduleAdmin
 * @description
 * # moduleAdmin
 */
angular.module('redthread')
  .directive('moduleAdmin', function ($stateParams, $rootScope, Auth, Session, Helper) {

    //Simpelt direktiv för att sköta ikonerna och deras funktionalitet i menymasten
    //Inkluderar även inloggningsmodulen

    return {
      restrict: 'EA',
      link: function ($scope) {
        
        Session.get().$promise.then(function (data) {

          //undersöker session och autentiseringsstatus
          //sätter autentiserad/oautentiserad beroende på sessioninfo
          Auth.setStatus(data.status);
          
          $scope.auth = Auth;
          $scope.authenticated = Auth.getStatus();

          $scope.$watch('auth.getStatus()', function(newValue) {

            //Väntar på att autentiseringsstatus ändras och applicerar det lokalt

            $scope.authenticated = newValue;
          });

          $scope.module = false;
          
          $scope.editStory = function() {

            //Körs när kugghjulet klickas
            //Ropar ut att den klickats över hela scopeträdet

            $rootScope.editing =! $rootScope.editing;
            $rootScope.$broadcast('editing', $rootScope.editing);
          };

          $scope.signin = function(form) {

            //Körs när inloggningsformuläret skickas
            //Validerar och passar infon till AUth servicen
            //Callback bestämmer autentiseringstatus och visar statusmeddelanden med Helper

            $scope.submitted = true;
            if(form.$valid) {
              Auth.login({
                story: $stateParams.slug,
                password: $scope.password
              },
              function(err) {
                $scope.errors = {};
                if (!err) {
                  Auth.setStatus(true);
                  Helper.set({'message': 'You\'ve logged in!', 'color': 'green'});
                  $scope.module = false;
                } else {
                  Helper.set({'message': err.status, 'color': 'red'});
                }
            });
            }
          };
          
          $scope.logout = function() {

            //Logoutfunktin, skickar vidare till Auth service

            Auth.logout(function(err) {
              if (!err) {
                Helper.set({'message': 'You\'ve logged out!', 'color': 'blue'});
                Auth.setStatus(false);
                $rootScope.$broadcast('editing', false);
              }
            });
          };
            
        });
      },
      templateUrl: './views/admin.html'
    };
  });