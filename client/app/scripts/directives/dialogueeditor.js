'use strict';

/**
 * @ngdoc directive
 * @name redthread.directive:dialogueEditor
 * @description
 * # dialogueEditor
 */
angular.module('redthread')
.directive('dialogueEditor', function(Stories, Characters, $stateParams, Threads, $rootScope) {

  //Direktiv som sköter all logik i dialogkartsläget

  function link(scope, element) {

    var i = 0,
        vp = angular.element(element[0].querySelector('#viewport')),
        threadWrapper = angular.element(element[0].querySelector('#threadwrapper'));
 

    scope.$on('editing', function(event, editing) {

      //Väntar på förändring av 'editing' uppåt i scopeträdet för att se om vi hamnat i eller lämnat dialogkartan

      if (editing) {
        startEdit();
      } else {
        $rootScope.characters = [];
      }
    });

    function startEdit() {

      //Init, hämtar storyn ifrån url slug 
      //Hämtar storyns trådar & karaktärer
      //Skapar en första tråd i mitten av kartan om inga trådar finns

      Stories.get({'slug': $stateParams.slug}).$promise.then(function(response) {
        scope.story = response;
        Threads.query({'storyId': scope.story._id}, function(response) {
          scope.threads = response;
          if (scope.threads.length === 0) {
            //No threads, create thread #0
            scope.createThread(1800,1800)
          }
        });
        Characters.query({'storyId': scope.story._id}, function(response) {
          scope.characters = response;
          $rootScope.characters = scope.characters;
          $rootScope.$broadcast('redraw');
        });
      });
    }

    scope.editThread = function(increment) {

      //Öppnar eller stänger trådediteringsförmuläret
      //Fyller trådediteringsförmuläret med info från tråden från passerat increment

      $rootScope.$broadcast('redraw');
      scope.threadEdit = !scope.threadEdit;
      if (increment) {
        scope.thread = scope.findThreadByIncrement(increment);
      }
      
    };

    scope.editChar = function(increment) {

      //Öppnar eller stänger karaktärsediteringsförmuläret

      $rootScope.$broadcast('redraw');
      scope.charEdit = !scope.charEdit;
    };

    scope.updatePosition = function(increment,pos) {

      //Körs ifrån move direktivet, när en tråd flyttat på sig

      scope.thread = scope.findThreadByIncrement(increment);
      scope.thread.pos = pos;
      scope.updateThread();
    };

    scope.findThreadByIncrement = function(increment) {

      //Returnerar trådobjekt från passerat trådid

      increment = Number(increment);
      for (var i = scope.threads.length - 1; i >= 0; i--) {
        if(scope.threads[i].increment === increment) {
          return scope.threads[i];
        }
      }
    }

    scope.createThread = function(x,y) {

      //Funktion för att skapa en ny tråd,
      //Formuläret är "tomt"

      var newThread = new Threads({
        pos: {x:x,y:y},
        text: scope.form.text,
        choices: scope.form.choices,
        location: scope.form.location,
        character: scope.form.character,
        toThread: NaN,
        inStory: scope.story._id
      });
      newThread.$save(function(thread){
        scope.threads.unshift(thread);
      });
    };

    scope.updateThread = function() {

      //Sker när vi vill spara förändringar av en tråd

      Threads.update({threadId: scope.thread._id}, scope.thread, function(thread){});
      $rootScope.$broadcast('redraw');
    };

    scope.addChoice = function() {

      //När en tråd behöver ett nytt alternativ

      scope.thread.choices.push({
        text: 'hmm',
        toThread: NaN
      });
    };

    scope.removeChoice = function(index) {

      //När en tråd inte längre behöver en specifik valmöjlighet(choice)

      scope.thread.choices.splice(index, 1);
      $rootScope.$broadcast('redraw');
    };

    scope.choiceOutChange = function() {

      //Körs när en av en tråds valmöjligheter ändrat vilken tråd som valet leder till

      $rootScope.$broadcast('redraw');
    }


    scope.removeThread = function(id) {

      //Tar bort en hel tråd från passerat trådid( körs från klick på delete )

      if (scope.thread.increment !== 0) {
        Threads.delete({threadId: id}, function(thread){
          for(var i = 0; i < scope.threads.length; i++) {
            if(scope.threads[i]._id === thread._id) {
              scope.threads.splice(i, 1);
              scope.editThread();
            }
          }
        });
      }
    };

    scope.createCharacter = function(x,y) {

      //Sker vid skapande av karaktär
      //Leder rakt in i karaktärsändringsformuläret via html

      var newCharacter = new Characters({
        name: 'John Doe',
        appearance: '',
        inStory: scope.story._id
      });
      newCharacter.$save(function(character){
        scope.characters.push(character);
        scope.changeCharacter(character._id);
        scope.editChar();
        scope.thread.character = character._id;
        $rootScope.characters = scope.characters;
      });
    };


    scope.ancestorHasClass = function(element, classname) {

      //Går upp i DOMträdet utgående från specifikt element och
      //letar efter om någon släkting har en specifik klass

      if (element && element.className !== undefined) {
        if (element.className.split(' ').indexOf(classname)>=0) return element;
        return element.parentNode && scope.ancestorHasClass(element.parentNode, classname);
      } else {
        return false;
      }
    }


    //hantera enbart musklick & inte drag, dvs. klick men inte drag
    //Används för att skapa ny tråd på kartan vid klick på kartan
    //Används för att editera tråd vid klick på tråd

    var startMouse = {};
    function startDrag(e) {
      if (e.which === 1) {

        //Gäller bara vid vänsterklick
        //Sparar ner muspositionen vid klick

        startMouse = {
          'x': e.pageX,
          'y': e.pageY
        };
      }
    }
    function stopDrag(e) {
      if (startMouse.x) {

        //Räkna ut avståndet mellan startMouse position och stopDrag position
        //Gör saker om avståndet är 0, då har vi inte dragit musen

        var dist = Math.sqrt( Math.pow((startMouse.x-e.pageX), 2) + Math.pow((startMouse.y-e.pageY), 2) );
        if (dist === 0) {
          if (e.target == vp[0]) {

            //Skapa tråd, men bara om vi klickat direkt exakt på kartan och inget annat

            scope.createThread(e.offsetX, e.offsetY);

          } else if(scope.ancestorHasClass(e.target, 'dedit-tbox')) {

            //Editera tråd om vi tryckt på ett trådelement

            var tboxIncrement = scope.ancestorHasClass(e.target, 'dedit-tbox').attributes.increment.value;
            scope.editThread(tboxIncrement);

          }
          
        }
      }
      startMouse = {};
    }

    //binder mushändelser till funktioner,
    //släpp körs på dokumentet och inte "vp"
    //för att vi vill ha funktionaliteten även när andra element är under musen(smått onödigt här)

    if(window.addEventListener) {
       vp[0].addEventListener('mousedown',startDrag,false);
       document.body.addEventListener('mouseup',stopDrag,false);
    }
    else if(window.attachEvent) {
       vp[0].attachEvent('onmousedown',startDrag);
       document.body.attachEvent('onmouseup',stopDrag);
    }



  }

  return {
    link: link
  };

});







