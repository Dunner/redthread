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

      //Applicerar klassen "editing" till body beroende på o mvi är i dialogkartan eller inte
      //Ger css möjligheten att rikta sig till sidan i endera läge

      if ($rootScope.editing) {
        document.body.className = 'editing';
      } else {
        document.body.className = '';
      }
    }

    //Statechange
    $rootScope.$on('$stateChangeStart', function () {

      //Rulla alltid upp till toppen efter "sidnavigering"

      $window.scrollTo(0, 0);
    });
    $rootScope.$on('$stateChangeSuccess', function () {

      //Rulla alltid upp till toppen efter "sidnavigering"

      $window.scrollTo(0, 0);

      //GE all kod koll på vart användaren är
      $rootScope.state = $state.current.name;
      checkEditing();
    });
    $rootScope.$on('$stateChangeError', function () {
      
      //Debug

      console.log('STATE CHANGE ERROR');
    });


    $rootScope.$on('editing', function (event, editing) {

      //Håller span på huruvuida vi är i dialogkarteläge eller inte
      //delar den informationen med checkEditing via delad variabel

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
      })
      
      .state('about', {
        url: '/about',
        templateUrl: 'views/about.html'
      });

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
  }]);