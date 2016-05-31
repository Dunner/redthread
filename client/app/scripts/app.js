'use strict';

/**
 * @ngdoc overview
 * @name redthread
 * @description
 * # redthread
 *
 * Main module of the application.
 */
angular
  .module('redthread', [
    'ui.router',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch'
  ])
  .run(   ['$rootScope', '$state', '$window',
  function ($rootScope,   $state,   $window) {
  

    function checkEditing() {
      if ($rootScope.editing) {
        document.body.className = 'editing';
      } else {
        document.body.className = '';
      }
    }

    //Statechange
    $rootScope.$on('$stateChangeStart', function () {
      $window.scrollTo(0, 0);
    });
    $rootScope.$on('$stateChangeSuccess', function () {
      $window.scrollTo(0, 0);
      $rootScope.state = $state.current.name;
      checkEditing();
    });
    $rootScope.$on('$stateChangeError', function () {
      console.log('STATE CHANGE ERROR');
    });
    $rootScope.$on('editing', function (event, editing) {
      $rootScope.editing = editing;
      checkEditing();
    });
    
  }])
  .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider',
  function ($locationProvider,   $stateProvider,   $urlRouterProvider,   $httpProvider) {
    // State Configurations //
    $httpProvider.defaults.withCredentials = true;

    $stateProvider
    
      .state('start', {
        url: '/',
        templateUrl: 'views/start.html',
        controller: 'startCtrl'
      })
      
      .state('story', {
        url: '/story/{slug}',
        templateUrl: 'views/story.html'
      });
      
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
  }]);