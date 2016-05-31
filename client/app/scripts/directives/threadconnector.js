'use strict';

/**
 * @ngdoc directive
 * @name redthread.directive:threadConnector
 * @description
 * # threadConnector
 */
angular.module('redthread')
.directive('threadConnector', function(Stories, $stateParams) {

  function link(scope, element, attrs) {

    function drawLine() {
      if (attrs.fromthread.length > 0 && attrs.tothread.length > 0) {


        function getRelativePosition(el, parentAttr) {
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

        var relPos = getRelativePosition(element[0], 'dedit-tbox');

        //From Dialogueeditor
        var fromThread = scope.findThreadByIncrement(attrs.fromthread),
            toThread = scope.findThreadByIncrement(attrs.tothread);

        var x1 = 0,
            x2 = 0,
            y1 = 0,
            y2 = 0;

        
        if (toThread !== undefined) {
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

    drawLine();

    scope.$on('redraw', function() {
      drawLine();
    }); 

  }
  return {
    link: link
  };

});







