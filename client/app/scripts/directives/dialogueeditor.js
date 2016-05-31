'use strict';

/**
 * @ngdoc directive
 * @name redthread.directive:dialogueEditor
 * @description
 * # dialogueEditor
 */
angular.module('redthread')
.directive('dialogueEditor', function(Stories, Characters, $stateParams, Threads, $rootScope) {

  function link(scope, element) {

    var i = 0,
        vp = angular.element(element[0].querySelector('#viewport')),
        threadWrapper = angular.element(element[0].querySelector('#threadwrapper'));
 

    scope.$on('editing', function(event, editing) {
      if (editing) {
        startEdit();
      } else {
        $rootScope.characters = [];
      }
    });

    function startEdit() {
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
      $rootScope.$broadcast('redraw');
      scope.threadEdit = !scope.threadEdit;
      if (increment) {
        scope.thread = scope.findThreadByIncrement(increment);
      }
      
    };

    scope.editChar = function(increment) {
      $rootScope.$broadcast('redraw');
      scope.charEdit = !scope.charEdit;
    };

    scope.updatePosition = function(increment,pos) {
      scope.thread = scope.findThreadByIncrement(increment);
      scope.thread.pos = pos;
      scope.updateThread();
    };

    scope.findThreadByIncrement = function(increment) {
      increment = Number(increment);
      for (var i = scope.threads.length - 1; i >= 0; i--) {
        if(scope.threads[i].increment === increment) {
          return scope.threads[i];
        }
      }
    }

    scope.createThread = function(x,y) {
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
      Threads.update({threadId: scope.thread._id}, scope.thread, function(thread){});
      $rootScope.$broadcast('redraw');

    };

    scope.addChoice = function() {
      scope.thread.choices.push({
        text: 'hmm',
        toThread: NaN
      });
    };

    scope.removeChoice = function(index) {
      scope.thread.choices.splice(index, 1);
      $rootScope.$broadcast('redraw');
    };


    scope.removeThread = function(id) {
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

    //Handle mouseclick & not drag
    var startMouse = {};
    function startDrag(e) {
      if (e.which === 1) {
        startMouse = {
          'x': e.pageX,
          'y': e.pageY
        };
      }
    }
    function stopDrag(e) {
      if (startMouse.x) {
        //Calculate distance between mouse press and release position
        var dist = Math.sqrt( Math.pow((startMouse.x-e.pageX), 2) + Math.pow((startMouse.y-e.pageY), 2) );
        if (dist === 0) {
          if (e.target == vp[0]) {

            //Create Thread
            scope.createThread(e.offsetX, e.offsetY);

          } else if(scope.ancestorHasClass(e.target, 'dedit-tbox')) {

            var tboxIncrement = scope.ancestorHasClass(e.target, 'dedit-tbox').attributes.increment.value;
            scope.editThread(tboxIncrement);

          }
          
        }
      }
      startMouse = {};
    }
    if(window.addEventListener) {
       vp[0].addEventListener('mousedown',startDrag,false);
       document.body.addEventListener('mouseup',stopDrag,false);
    }
    else if(window.attachEvent) {
       vp[0].attachEvent('onmousedown',startDrag);
       document.body.attachEvent('onmouseup',stopDrag);
    }

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


  }

  return {
    link: link
  };

});







