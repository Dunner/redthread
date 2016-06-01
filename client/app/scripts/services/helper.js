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

    //Enkel tjänst som agerar so minne och kommunikatör av "hjälpmeddelanden"

    var factory = [],
        message = {};
    
    factory.get = function() {

      //Skickar sparat hjälpmeddelanden

      return message;
    };
    
    factory.set = function(value) {
      //sparar hjälpmeddelande

      if (typeof value === 'object'){
        message = value;
      }
    };
    
    return factory;
    
  });