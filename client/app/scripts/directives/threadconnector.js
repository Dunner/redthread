'use strict';

/**
 * @ngdoc directive
 * @name redthread.directive:threadConnector
 * @description
 * # threadConnector
 */
angular.module('redthread')
.directive('threadConnector', function() {

  function link(scope, element, attrs) {

    //Detta direktiv ansvarar för att rita ut en linje mellan två trådar(threads)
    //Den gör detta igenom att titta på sina egna attribut fromthread och tothread

    function drawLine() {

      //Vi placerar direktivets kod i en funktion så vi kan rita om linjen när något förändras

      if (attrs.fromthread.length > 0 && attrs.tothread.length > 0) {

        var relPos = getRelativePosition(element[0], 'dedit-tbox');

        //findThreadByIncrement från dialogueeditor
        var fromThread = scope.findThreadByIncrement(attrs.fromthread),
            toThread = scope.findThreadByIncrement(attrs.tothread);

        var x1 = 0,
            x2 = 0,
            y1 = 0,
            y2 = 0;

        
        if (toThread !== undefined) {

          //Matematik för att räkna ut först vart våra två element är
          //Och sedan dra en linje mellan dem.

          x2 = fromThread.pos.x - toThread.pos.x + relPos.x0;
          y2 = fromThread.pos.y - toThread.pos.y + relPos.y0;

          var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)),
              angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI + 180,
              transform = 'rotate('+ angle +'deg)';
          
          angular.element(element).css({
            'transform': transform,
            'width': length+'px',
          });
        }

      }
    }


    function getRelativePosition(el, parentAttr) {

      //Snurrar igenom ett elements föräldrar tills den hittar ett visst attribut
      //För varje steg upp i domträdet adderas den grenens offset till sin egen far
      //När funktionen hittat sitt attribut returnerar det alltså elementet vi passats
      //totala offset till elementet med attributet, uttnyttjar ancestorhasClass från dialogueeditor

      var tempEl = el,
          x0 = 0, 
          x1 = 0,
          y0 = 0,
          y1 = 0;

      while( scope.ancestorHasClass(el, parentAttr) && el !== scope.ancestorHasClass(el, parentAttr) ) {
        x0 += (el.offsetLeft - el.scrollLeft + el.clientLeft);
        y0 += (el.offsetTop - el.scrollTop + el.clientTop);
        el = el.offsetParent;
      }
      x1 = x0 + tempEl.offsetWidth;
      y1 = y0 + tempEl.offsetHeight;
      return { x0: x0, y0: y0, x1: x1, y1: y1 };
    }

    //Initiering
    drawLine();

    scope.$on('redraw', function() {

      //lyssnar uppåt i trådet efter ett rop på 'redraw'

      drawLine();
    }); 

  }
  return {
    link: link
  };

});







