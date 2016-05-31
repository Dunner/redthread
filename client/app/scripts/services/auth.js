'use strict';

/**
 * @ngdoc service
 * @name redthread.auth
 * @description
 * # auth
 * Factory in the redthread.
 */
angular.module('redthread')
  .factory('Auth', function Auth(Session) {
    var factory = [],
        status = false;
    
    factory.getStatus = function() {
      return status;
    };
    
    factory.setStatus = function(value) {
      if (typeof value === 'boolean'){
        status = value;
      }
    };
    
    factory.login = function(data, callback) {
      var cb = callback || angular.noop;
      Session.save({
        story: data.story,
        password: data.password,
        rememberMe: data.rememberMe
      }, function() {
        return cb();
      }, function(err) {
        return cb(err.data);
      });
    };

    factory.logout = function(callback) {
      var cb = callback || angular.noop;
      Session.delete(function() {
          return cb();
        },
        function(err) {
          return cb(err.data);
        });
    };
    
    return factory;
    
  });