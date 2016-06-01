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

    //Tjänst som handahåller vår autentiseringstatus och kan prata med våra olika kontroller och direktiv
    //Sköter även all sändning av information till Sessionsresursen(API crud)

    var factory = [],
        status = false;
    
    factory.getStatus = function() {

      //Returnerar användarens auttentiseringsstatus

      return status;
    };
    
    factory.setStatus = function(value) {

      //Ändrar användarens auttentiseringsstatus

      if (typeof value === 'boolean'){
        status = value;
      }
    };
    
    factory.login = function(data, callback) {

      //Kallas för inloggning och skickar vidare till Sessionsresursen

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

      //Kallas för utloggning och skickar vidare till Sessionsresursen

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