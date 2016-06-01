'use strict';


//Detta dokument innehåller alla APIresurser och "logiken" för informationsskick till servern.
//https://docs.angularjs.org/api/ngResource/service/$resource
// ---
//Varje resurs kan alltså kallas med t.ex. save eller query för att skapa post eller get förfågningar till servern på resursens specifika url med paramter


/**
 * @ngdoc service
 * @name redthread.Stories
 * @description
 * # Stories
 * Service in the redthread.
 */

angular.module('redthread')
   .service('Stories', function ($resource) {
      return $resource('api/stories/:slug', {
         slug: '@slug'
      });
   });

/**
 * @ngdoc service
 * @name redthread.Threads
 * @description
 * # Threads
 * Service in the redthread.
 */

angular.module('redthread')
   .service('Threads', function ($resource) {
      return $resource('api/threads/:storyId/:threadId', {
         storyId: '@storyId',
         threadId: '@threadId'
      }, {
         update: {
            method: 'PUT'
         }
      });
   });

/**
 * @ngdoc service
 * @name redthread.Characters
 * @description
 * # Characters
 * Service in the redthread.
 */

angular.module('redthread')
   .service('Characters', function ($resource) {
      return $resource('api/characters/:storyId/:characterId', {
         storyId: '@storyId',
         characterId: '@characterId'
      }, {
         update: {
            method: 'PUT'
         }
      });
   });

/**
 * @ngdoc service
 * @name redthread.session
 * @description
 * # session
 * Service in the redthread.
 */
angular.module('redthread')
  .service('Session', function ($resource) {
    return $resource('/api/session/');
  });

