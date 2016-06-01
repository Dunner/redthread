'use strict';

/**
 * @ngdoc filter
 * @name redthread.filter:toArray
 * @function
 * @description
 * # toArray
 * Filter in the redthread.
 */
angular.module('redthread')
  .filter('toArray', function () {

    //Filter som konverterar objekt till listor, för itterering(ng-repeat) av angular
    //Tillåter filtrering och sortering
    //Lite som att loopa object keys

    return function (obj, addKey) {
      if ( addKey === false ) {
        return Object.keys(obj).map(function(key) {
          return obj[key];
        });
      } else {
        return Object.keys(obj).map(function (key) {
          if(typeof obj[key] === 'object') {
            return Object.defineProperty(obj[key], '$key', {enumerable: false, value: key});
          }
        });
      }
    };
  });
