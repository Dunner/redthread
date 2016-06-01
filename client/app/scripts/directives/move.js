'use strict';

/**
 * @ngdoc directive
 * @name redthread.directive:move
 * @description
 * # move
 */
angular.module('redthread')
.directive('move', function() {

  //Direktiv som tillåter förflyttelse av "trådar"(threads)" i dialogkartan
  //Igenom att dra, peka och släppa med muspekare

  function link(scope, element) {
    var me = element[0],
        self = {};

    if(window.addEventListener) {

      //binder mushändelser till funktioner,
      //drag och släpp körs på dokumentet och inte "me"
      //för att vi vill ha funktionaliteten även när andra element är under musen

      me.addEventListener('mousedown',startDrag,false);
      document.body.addEventListener('mousemove',drag,false);
      document.body.addEventListener('mouseup',stopDrag,false);
    }
    else if(window.attachEvent) {

      //binder mushändelser till funktioner,
      //drag och släpp körs på dokumentet och inte "me"
      //för att vi vill ha funktionaliteten även när andra element är under musen

      me.attachEvent('onmousedown',startDrag);
      document.body.attachEvent('onmousemove',drag);
      document.body.attachEvent('onmouseup',stopDrag);
    }

    function startDrag(e) {
      if (e.which === 1) {

        //Ser till att det bara gäller vänsterklick

        if(Object.keys(self).length === 0 && self.constructor === Object) {

          //Körs när vi håller ner musknappen var self är ett objekt

          e=e||event;

          self.panStartX = e.pageX;
          self.panStartY = e.pageY;
          self.pageTop = parseInt(angular.element(me).css('top'), false) || 0;
          self.pageLeft = parseInt(angular.element(me).css('left'), false) || 0;
        };
      }
    }

    function drag(e) {
      if(Object.keys(self).length > 0 && self.constructor === Object) {

        //Körs när vi flyttar musen över dokumentet och self objektet har nycklar
        //har self objektet nycklar så trycker vi ner musen, alltså blir detta en dragfunktion

        e=e||event;
        var pageTop = self.pageTop;
        var pageLeft = self.pageLeft;
        self.panEndX = e.pageX;
        self.panEndY = e.pageY;
        
        //lodrätt
        if (self.panStartY > self.panEndY) {

          //upp
          self.panTop = self.panStartY - self.panEndY;
          
          pageTop-= self.panTop;
          
          
          angular.element(me).css({ top: pageTop+'px', left: pageLeft+'px' });
        } else {
          // ned
          self.panTop = self.panEndY - self.panStartY;
          
          pageTop+= self.panTop;
          
          angular.element(me).css({ top: pageTop+'px', left: pageLeft+'px' });
        }
      
        //sidled
        if (self.panStartX > self.panEndX) {
          //vänster
          self.panLeft = self.panEndX - self.panStartX;
          
          pageLeft+= self.panLeft;
          
          angular.element(me).css({ left: pageLeft+'px', top: pageTop+'px' });
        } else {
          
          // höger
          self.panLeft = self.panStartX - self.panEndX;

          pageLeft-= self.panLeft;

        
          angular.element(me).css({ left: pageLeft+'px', top: pageTop+'px' });
        }

      }

    }
    
    function stopDrag(e) {
      if(Object.keys(self).length > 0 && self.constructor === Object) {

        //Körs när musen slutar vara intryckt på dokumentet
        //Tömmer self på nycklar
        //Flyttar på elementet
        //Berättar för dialougeeditor att elementet potentielltt har rört på sig
        //Berättar vilket element och vart det befinner sig

        e=e||event;
        self={};

        var pos = {
          'x': parseInt(angular.element(me).css('left'), false) || 0,
          'y': parseInt(angular.element(me).css('top'), false) || 0
        }
        
        var tboxIncrement = parseInt(angular.element(me)[0].attributes.increment.value, false) || 0;
        scope.updatePosition(tboxIncrement, pos);
      }
    }



  }

  return {
    link: link
  };

});

