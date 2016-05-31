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
        $scope.stories.push(post);
        $scope.writeNew = false;
        $scope.form = {name: '', password: ''};
      });
    };
    
  });
