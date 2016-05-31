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
    return function (text) {
      return text.replace(/[^a-z0-9_ -]/gi, '').replace(/\s+/g, '-').toLowerCase();
    };
  });
