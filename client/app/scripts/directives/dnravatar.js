/*global Snap:false */
'use strict';

/**
 * @ngdoc directive
 * @name redthread.directive:dnrAvatar
 * @description
 * # dnrAvatar
 */
angular.module('redthread')
  .directive('dnrAvatar', function ($rootScope) {
    function link(scope, element, attrs) {
      var canvas = new Snap(element[0]);

      function Slot(type) {
        this.type = type;
        this.name = '';
        this.color = '';
      }
      scope.paperdoll = {
        face: new Slot('face'),
        hair: new Slot('hair'),
        ears: new Slot('ears'),
        eyes: new Slot('eyes'),
        iris: new Slot('iris'),
        nose: new Slot('nose'),
        mouth: new Slot('mouth'),
        mustache: new Slot('mustache'),
        eyebrows: new Slot('eyebrows'),
        beard: new Slot('beard'),
        glasses: new Slot('glasses')
      };

      function getCharacterLoad(id) {
        for (var i = $rootScope.characters.length - 1; i >= 0; i--) {
          var character = $rootScope.characters[i];
          if (character._id === id) {
            buildCharacter(character.appearance);
          }
        }
      };

      function buildCharacter(load) {
        if (load.length < 5) {
          scope.randomize();
        } else {
          angular.forEach(load.split(' '), function(value) {
            var slotInfo = value.split(':');
            var type = slotInfo[0].split('_')[0];
            var name = slotInfo[0].split('_')[1];
            scope.paperdoll[type].type = type;
            scope.paperdoll[type].name = name;
            scope.paperdoll[type].color = slotInfo[1];
          });
          paintCharacter(scope.paperdoll);
        }
      }

      function paintCharacter(array) {
        Snap.load('data/character/combined.svg', function (image) {
          canvas.paper.clear();

          function paintE(section) {
            if (section !== undefined) {
              if (section.color !== undefined) {
                if (section.color.length > 2) {
                  var paint = image.select('#' + section.type + '_' + section.name + '_color');
                  if (paint !== null) {paint.attr({'fill': section.color});}
                }
              }
              var el = image.select('#' + section.type + '_' + section.name);
              if (el !== null) {
                el.attr({'z-index': section.zIndex});
                canvas.append(el);
              }
            }
          }

          paintE(array.ears);
          paintE(array.face);
          paintE(array.iris);
          paintE(array.eyes);
          paintE(array.mouth);
          paintE(array.mustache);
          paintE(array.beard);
          paintE(array.nose);
          paintE(array.eyebrows);
          paintE(array.glasses);
          paintE(array.hair);
        });
      }

      scope.$on('redraw', function() {
        init();
      });
      scope.$on('nextthread', function() {
        init();
      });

      function init() {
        canvas.paper.clear();
        setTimeout(function(){
          getCharacterLoad(attrs.load);
        },100);
      }

    }
    return {
      restrict: 'A',
      scope: {},
      link: link
    };

  });