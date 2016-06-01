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

    //Controller för vår startsida
    //hämtar alla berättelser
    //hanterar skapandet av nya berättelser
    
    $scope.form.password = $scope.form.name = '';

    Stories.query(function(response) {

      //hämtar alla berättelser

      $scope.stories = response;
    });
    
    $scope.addStory = function() {

      //hanterar skickning av ny berättelse formuläret

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
