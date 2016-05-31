'use strict';

/**
 * @ngdoc service
 * @name redthread.helper
 * @description
 * # helper
 * Factory in the redthread.
 */
angular.module('redthread')
  .factory('Helper', function Helper() {
    var factory = [],
        message = {};
    
    factory.get = function() {
      return message;
    };
    
    factory.set = function(value) {
      if (typeof value === 'object'){
        message = value;
      }
    };
    
    return factory;
    
  });