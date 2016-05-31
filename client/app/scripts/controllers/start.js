'use strict';

/**
 * @ngdoc function
 * @name redthreadApp.controller:startCtrl
 * @description
 * # startCtrl
 * Controller of the redthread
 */
angular.module('redthread')
  .controller('startCtrl', function ($scope, Stories, $filter) {
    
    $scope.form.password = $scope.form.name = '';

    Stories.query(function(response) {
      $scope.stories = response;
    });
    
    $scope.addStory = function() {
      var newStory = new Stories({
        name: $scope.form.name,
        password: $scope.form.password,
        slug: $filter('slug')($scope.form.name),
        completed: false
      });
      newStory.$save(function(post){
        $scope.stories.unshift(post);
        $scope.writeNew = false;
        $scope.form = {name: '', password: ''};
      });
    };
    
  });
