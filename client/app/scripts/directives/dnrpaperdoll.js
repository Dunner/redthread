/*global Snap:false */
'use strict';

/**
 * @ngdoc directive
 * @name redthread.directive:dnrPaperdoll
 * @description
 * # dnrPaperdoll
 */
angular.module('redthread')
  .directive('dnrPaperdoll', function ($rootScope, Characters) {

    //Direktiv som tillåter skapande/förändrande av svgkaraktär/avatar

    return function (scope, element, attrs) {
      attrs.disable = '';


      scope.specificColor = '#CDA184';
      scope.option = 'face';
      scope.edit = 'shape';
      scope.palette = 'skintones';

      scope.changeOption = function(option) {

        //Körs när karaktärsdrags huvudnavigering klickas
        //bestämmer vilka underkategorier som bör visas

        scope.option = option;
        scope.changeEdit(scope.optionsTree[option].defaultOption);
      };
      scope.changeEdit = function(option) {

        //Körs när karaktärsdrags underkategorier klickas

        scope.edit = option;
        scope.palette = scope.optionsTree[scope.option].options[scope.edit].palette;
        scope.select(scope.optionsTree[scope.option].options[scope.edit].select);
        scope.changeEditUpdate();
      };

      scope.changeEditUpdate = function () {

        //bestämmer vilka karaktärsdrag/delar/utsyrslar som bör visasa
        //Utgår ifrån val a karaktärsdrags huvud och subnavigering för att bestämma vad

        scope.inventoryOption = scope.optionsTree[scope.option].options[scope.edit].select;
        Snap.load('images/characters.svg', function (image) {
          scope.inventory = image.selectAll('g[inkscape\\:label="#'+scope.inventoryOption[0]+'"]').items;
          for (var i = scope.inventory.length - 1; i >= 0; i--) {
            var name = scope.inventory[i].node.id.split('_');
            scope.inventory[i].name = name[1];
          }
          scope.$apply();
        });
      };

      scope.$watch(

        //Hanterar färgpalettsval, ur bruk för tillfället TODO

        function( scope ) {
          return( scope.specificColor );
        }, function( color ) {
          if (color !== '#CDA184') {
            scope.changeColor(scope.toEdit, color, scope.inventoryOption);
          }
        }
      );

      scope.changeCharacter = function(id) {

        //Funktion som körs när karaktärsediteringsmodulen öppnas
        //Ser till att vi ser den karaktär vi vill ändra på
        //Byter ut karaktären utifrån passerat karaktärsid
        //Kör buildCharacter

        $rootScope.$broadcast('redraw');
        for (var i = scope.characters.length - 1; i >= 0; i--) {
          var character = scope.characters[i];
          if (character._id === id) {
            scope.character = character;
            buildCharacter(scope.character.appearance);
            scope.changeOption('face');
            $rootScope.$broadcast('redraw');
          }
        }


      };


      scope.saveChar = function() {

        //Körs vid sparning av karaktär
        //Går över paperdoll och gör om til textsträng för sparning i db

        var protLoad = [];
        angular.forEach(scope.paperdoll, function(part) {
          if (part.name !== undefined &&
              part.color !== undefined &&
              part.type !== undefined) {
            protLoad.push(part.type+'_'+part.name+':'+part.color);
          }
        });
        var load = protLoad.join(' ');
        scope.character.appearance = load;
        Characters.update({characterId: scope.character._id}, scope.character, function(){
          scope.editChar();
        });
      };


      //Colors bestämmer vilka färger vi har visa i paletten
      scope.colors = {
        'skintones': [
          'rgb(240, 199, 177)',
          'rgb(243, 212, 207)',
          'rgb(255, 208, 188)',
          'rgb(217, 184, 175)',
          'rgb(217, 164, 148)',
          'rgb(233, 185, 149)',
          'rgb(245, 175, 149)',
          'rgb(225, 158, 149)',
          'rgb(218, 164, 136)',
          'rgb(242, 170, 146)',
          'rgb(236, 196, 184)',
          'rgb(246, 228, 226)',
          'rgb(238, 170, 131)',
          'rgb(205, 161, 132)'],
        'makeup': [
          'rgb(169, 0, 148)'],
        'haircolors': [
          'rgb(77, 31, 31)'],
        'eyes': [
          'rgb(16, 122, 168)']
      };

      //Optionstree utgör vilka menyalternativ vi har
      //Och vilka färgalternativ som passar bäst till vilka menyval
      scope.optionsTree = {
        'face':{
          'index': 1,
          'defaultOption': 'shape',
          'options':{
            'shape': {
              'index': 1,
              'removeable': false,
              'select': ['face', 'ears', 'eyes'],
              'palette':'skintones'},
            'mouth': {
              'index': 2,
              'removeable': false,
              'select': ['mouth'],
              'palette':'skintones'},
            'nose': {
              'index': 3,
              'removeable': false,
              'select': ['nose', 'face', 'ears', 'eyes'],
              'palette':'skintones'},
            'ears': {
              'index': 4,
              'removeable': false,
              'select': ['ears', 'face', 'eyes'],
              'palette':'skintones'}}},
        'hair':{
          'index': 2,
          'defaultOption': 'hairstyle',
          'options':{
            'hairstyle': {
              'index': 1,
              'removeable': true,
              'select': ['hair'],
              'palette':'skintones'},
            'mustache': {
              'index': 2,
              'removeable': true,
              'select': ['mustache'],
              'palette':'skintones'},
            'beard': {
              'index': 3,
              'removeable': true,
              'select': ['beard'],
              'palette':'skintones'},
            // 'arms': {
            //   'index': 4,
            //   'removeable': true,
            //   'select': ['arms'],
            //   'palette':'skintones'}
            }},
        'eyes':{
          'index': 3,
          'defaultOption': 'shape',
          'options':{
            'shape': {
              'index': 1,
              'select': ['eyes'],
              'palette':'skintones'},
            'iris': {
              'index': 2,
              'select': ['iris'],
              'palette':'skintones'},
            'eyebrows': {
              'index': 3,
              'removeable': true,
              'select': ['eyebrows'],
              'palette':'skintones'},
            'glasses': {
              'index': 4,
              'removeable': true,
              'select': ['glasses'],
              'palette':'skintones'}}},
        //'clothes':{'index': 4},
        // 'jewelry':{'index': 5},
        // 'scars':{'index': 6},
      };

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
      
      var canvas = new Snap(document.getElementById('paperdoll'));


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

      scope.randomize = function() {

        //Randomfunktion som snabbt skapar en slumpmössig karaktär utifrån de karaktärsdrag som finns tillgängliga

        Snap.load('images/characters.svg', function (image) {

          angular.forEach(scope.paperdoll, function(item, slot) {
            var posibilities = image.selectAll('g[inkscape\\:label="#'+slot+'"]').items;
            var randomchosen = posibilities[ Math.floor(Math.random() * posibilities.length)  ];
            if (randomchosen !== undefined) {
              item.name = randomchosen.node.id.split('_')[1];
              item.color = '#';
            }
          });
          paintCharacter(scope.paperdoll);

        });
      };

      //var load = 'face_slob:#d6ad94 ears_default:#d6ad94 eyes_default:#d6ad94 iris_default:#c4caff nose_default:# mouth_default:# mustache_slob:#212121 eyebrows_default:#292929 glasses_monocleL:#38ffef';
      // scope.randomize();
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

      scope.select = function (array) {

        //Används för att bestämma vad som är aktivt/väljt, främst för att kunna ändra färgalternativ på enskidla delar(t.ex. läppar)

        scope.toEdit = [];
        for (var i = array.length - 1; i >= 0; i--) {
          if (scope.paperdoll[array[i]].name === undefined) {continue;}
          scope.toEdit.push('#' + array[i] + '_' + scope.paperdoll[array[i]].name + '_color');
        }
      };
      scope.select(['face', 'ears', 'nose']);

      scope.updateDoll = function (option, edit, type, name) {
        if (scope.paperdoll[type].name !== undefined) {
          // var test = canvas.select('#' + type + '_' + scope.paperdoll[type].name);
          // test.stop().animate({'opacity': '0'}, 300);
          // setTimeout(function(){
          //   test.remove();
          //   scope.paperdoll[type].name = name;
          //   scope.select(scope.optionsTree[option].options[edit].select);
          //   paintCharacter(scope.paperdoll);
          //   scope.$apply();
          // },300);
          scope.paperdoll[type].name = name;
          scope.select(scope.optionsTree[option].options[edit].select);
          paintCharacter(scope.paperdoll);
        } else {
          scope.paperdoll[type].name = name;
          scope.paperdoll[type].type = type;
          scope.paperdoll[type].color = '#';
          scope.select(scope.optionsTree[option].options[edit].select);
          paintCharacter(scope.paperdoll);
        }

      };



      // scope.changeColor = function (array, color, types) {
      //   ur bruk atm TODO
      //   angular.forEach(types, function(type) {
      //     scope.paperdoll[type].color = color;
      //   });
      //   angular.forEach(array, function(el) {
      //     if (el.indexOf('__') === -1) {
      //       canvas.select(el).animate({'fill': color}, 100);
      //     }
      //   });
      // };


    };
  });
