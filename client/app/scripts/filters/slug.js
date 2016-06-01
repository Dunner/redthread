'use strict';

/**
 * @ngdoc filter
 * @name redthread.filter:slug
 * @function
 * @description
 * # slug
 * Filter in the redthread.
 */
angular.module('redthread')
  .filter('slug', function () {

  	//Supersmidigt filter som gör en textsträng urlvänlig, ger b.la. alla berättelser en representativ url

    return function (text) {
      return text.replace(/[^a-z0-9_ -]/gi, '').replace(/\s+/g, '-').toLowerCase();
    };
  });
