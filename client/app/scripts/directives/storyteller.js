'use strict';

/**
 * @ngdoc directive
 * @name redthread.directive:storyteller
 * @description
 * # storyteller
 */
angular.module('redthread')
.directive('storyteller', function($rootScope, Stories, Characters, $stateParams, Threads) {

  function link(scope, element) {

    
    var i = 0,
        timeouts = [],
        scrollBoxElement = angular.element(element[0].querySelector('#messages')),
        speedDragElement = angular.element(element[0].querySelector('#speed-drag')),
        speedDragIndicatorElement = angular.element(element[0].querySelector('#speed-drag-indicator')),
        speedDragDragging = false,
        readingSpeed = 40;

    scope.$on('editing', function (event, editing) {
      console.log(editing)
      if (!editing) {
        startStory();
      } else {
        scope.threadflow = [];
        scope.threads = [];
        scope.characters = [];
        $rootScope.$broadcast('nextthread');
        clearTimeouts(); 
      }
    }); 

    function startStory() {

      scope.threadflow = [];
      scope.threads = [];
      scope.characters = [];
      $rootScope.$broadcast('nextthread');
      clearTimeouts();

      Stories.get({'slug': $stateParams.slug}).$promise.then(function(response) {
        scope.story = response;
        Threads.query({'storyId': scope.story._id}, function(response) {
          scope.threads = response;
          scope.displayThread(0);
        });
        Characters.query({'storyId': scope.story._id}, function(response) {
          scope.characters = response;
          $rootScope.characters = scope.characters;
        });
      });

    }

    startStory();

    function findThreadByIncrement(increment) {
      increment = Number(increment);
      for (var i = scope.threads.length - 1; i >= 0; i--) {
        if(scope.threads[i].increment === increment) {
          return scope.threads[i];
        }
      }
    }

    scope.displayThread = function(increment) {
      clearTimeouts();
      increment = Number(increment);
      var thread = findThreadByIncrement(increment);

      if (thread.text) {

        setTimeout(function(){
          scope.$apply();
          scrollToBottom(scrollBoxElement[0],1000);
        },200);
        scope.threadflow.push(thread);
        scope.currentThread = thread;
        $rootScope.$broadcast('nextthread');

        if ( thread.choices.length < 1 && thread.toThread) {
          //Hoppa till nästa meddelande
          //Avvänta Beroende av hur många bokstäver nuvarande trådtext består av
          //Samt hastighetsreglaget(readingspeed)
          //Sker automatiskt för ointeraktiva trådar för att visa nästa tråd.
          var time = (thread.text.length+30) * readingSpeed;
          timeouts.push(setTimeout(function(){
            scope.displayThread(thread.toThread)
          },time));
        } 
      }
    
    }

    scope.jumpUpTree = function(increment, index) {
      console.log(scope.threadflow.length, index)
      scope.threadflow.splice( index+1, 99)
    }
    
    var timeout;
    //Scrollskötning
    function scrollToBottom(el, duration) {
      //Rulla ner så vi alltid ser vårat nyaste meddelande när vi vill
      //Hoppar inte, accelerar och deaccelererar
      if ((el !== null || undefined )) {
        var currentTime = 0, start = el.scrollTop;
        var animateScroll = function(){
          var stop = el.scrollHeight - el.clientHeight,
              change = stop - start,
              increment = 5;
          currentTime += increment;
          var val = easeInOutQuad(currentTime, start, change, duration);
          el.scrollTop = val;
          if(currentTime < duration) {
            //Animationen är inte färdig
            clearTimeout(timeout);
            //fortsätt "loopa" animationen
            //increment timeout styr pixelhoppavstånd mellan framesen
            timeout = setTimeout(animateScroll, increment);
          } else {
            //Animationen är slut
            clearTimeout(timeout);
          }
        };
        animateScroll(); //Initiera animation
      }
      // Mattematisk uträkning för animationens "momentum"
      function easeInOutQuad(t, b, c, d) {
        // Easing Equations by Robert Penner http://gizma.com/easing/
        t /= d/2;
        if (t < 1) {return c/2*t*t + b;}
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
      }
      
    }


    //Nedan handlar om uppläsningshastighetsreglaget, dålig UX atm. TODO

    function adjustReadSpeed(e) {
      if (speedDragDragging) {
        //Körs när man drar i hastighetsreglaget längst ner på sidan
        var indicatorX = Math.floor(e.pageX - posFromLeft(speedDragElement));
        var draggerWidth = speedDragElement.offsetWidth;
        readingSpeed = ((indicatorX / draggerWidth) * 100).toFixed(2);
        console.log(indicatorX,draggerWidth,readingSpeed);
        speedDragIndicatorElement.style.left = indicatorX.toFixed(2) + 'px';
      }
      function posFromLeft(obj) {
        //Linear upp muspositionen med reglagets sidoffset så vi kan räkna ut var på elementet vi drar någonstans.
        var offLeft = 0;
        if (obj.offsetParent) {
          do {
            offLeft += obj.offsetLeft;
          } while (obj == obj.offsetParent);
          return offLeft;
        }
      }
    }

    //Muspekar event
    speedDragElement.onmousemove=function(e){
      adjustReadSpeed(e);
    };
    speedDragElement.onmousedown=function(e){
      speedDragDragging = true;
      adjustReadSpeed(e);
    };
    document.onmouseup=function(){
      speedDragDragging = false;
    };


    function clearTimeouts() {
      //Clearar alla timeouts som lagts till i timeout listan.
      for (var i=0; i<timeouts.length; i++) {
        clearTimeout(timeouts[i]);
      }
      //Töm timeout listan.
      timeouts = [];
    }


  }
  return {
    link: link
  };

});







