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

    //Direktiv som tillåter en karaktär att målas upp i vilket svgelement som helst
    //Kräver attribut med karaktärsid

    function link(scope, element, attrs) {
      var canvas = new Snap(element[0]);

      function Slot(type) {

        //Gemensam struktur för kroppsdel/utstyrsels information
        //Används flitigt av paperdoll för att bygga upp de delar vår avatar kan bestå av

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

        //Hämtar en karaktärs sparade strängvariant av paperdoll utifrån givet karaktärsid
        //passerar detta till buildCharacter

        for (var i = $rootScope.characters.length - 1; i >= 0; i--) {
          var character = $rootScope.characters[i];
          if (character._id === id) {
            buildCharacter(character.appearance);
          }
        }
      };

      function buildCharacter(load) {

        //Bygger upp paperdollstruktur av textsträng
        //Passerar skapad paperdoll till paintCharacter
        //Är textsträngen invalid körs randomize

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

        //Funktion som laddar in svgfilen med alla möjliga karaktärsdrag
        //Printar serdan ut svgbild av alla drag som passerats in i array(paperdoll format)

        Snap.load('images/characters.svg', function (image) {
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

          //Inte loopat för kontroll av vad som målas

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


      function init() {

        //plockar loadattribut från elementet direktivet sitter på
        //förväntas vara ett karaktärsid, passar det till getCharacterLoad

        setTimeout(function(){
          canvas.paper.clear();
          getCharacterLoad(attrs.load);
        },500);
      }

      scope.$on('redraw', function() {

        //Ligger och väntar på att köras, 
        //tillåter att vi målar om vår karaktär när denna förändras eller byts ut

        init();
      });
      scope.$on('nextthread', function() {

        //Ligger och väntar på att köras, 
        //tillåter att vi målar om vår karaktär när denna förändras eller byts ut

        init();
      });


    }
    return {
      restrict: 'A',
      scope: {},
      link: link
    };

  });