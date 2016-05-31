'use strict';

/**
 * @ngdoc directive
 * @name redthread.directive:pan
 * @description
 * # pan
 */
angular.module('redthread')
.directive('pan', function() {

  function link(scope, element) {
    element[0].id = "viewport";
    var vp = element[0],
        self = {};


    if(window.addEventListener) {
       vp.addEventListener('mousedown',startDrag,false);
       document.body.addEventListener('mousemove',drag,false);
       document.body.addEventListener('mouseup',stopDrag,false);
    }
    else if(window.attachEvent) {
       vp.attachEvent('onmousedown',startDrag);
       document.body.attachEvent('onmousemove',drag);
       document.body.attachEvent('onmouseup',stopDrag);
    }


    setTimeout(function(){
      (function centerViewport() {
        angular.element(vp).css({
          'top': -(vp.clientHeight - document.body.clientHeight)/2 + 'px',
          'left': -(vp.clientWidth - document.body.clientWidth)/2 + 'px' 
        });
       })();
    },100)
    

   

    function startDrag(e) {
      if(Object.keys(self).length === 0 && self.constructor === Object && e.target.id == 'viewport') {
        e=e||event;

        self.panStartX = e.pageX;
        self.panStartY = e.pageY;
        self.pageTop = parseInt(angular.element(vp).css('top'), false) || 0;
        self.pageLeft = parseInt(angular.element(vp).css('left'), false) || 0;
      };
    }
    function drag(e) {
      if(Object.keys(self).length > 0 && self.constructor === Object) {
        e=e||event;
        var pageTop = self.pageTop;
        var pageLeft = self.pageLeft;
        self.panEndX = e.pageX;
        self.panEndY = e.pageY;
        
        //vertical
        if (self.panStartY > self.panEndY) {

          //up
          self.panTop = self.panEndY - self.panStartY;
          
          pageTop+= self.panTop;
          
          
          angular.element(vp).css({ top: pageTop+'px',left: pageLeft+'px' });
        } else {
          // Down
          self.panTop = self.panStartY - self.panEndY;
          
          pageTop-= self.panTop;
          if (pageTop > 42) pageTop = 42;
          
          angular.element(vp).css({ top: pageTop+'px',left: pageLeft+'px' });
        }
      
        //horizontal
        if (self.panStartX > self.panEndX) {
          //right
          self.panLeft = self.panEndX - self.panStartX;
          
          pageLeft+= self.panLeft;
          
          angular.element(vp).css({ left: pageLeft+'px',top: pageTop+'px' });
        } else {
          
          // left
          self.panLeft = self.panStartX - self.panEndX;

          pageLeft-= self.panLeft;

          if (pageLeft > 42) pageLeft = 42;
          
          angular.element(vp).css({ left: pageLeft+'px',top: pageTop+'px' });
        }

      }
    }
    function stopDrag(e) {
      if(Object.keys(self).length > 0 && self.constructor === Object) {
        e=e||event;
        self={};
      }
    }



  }

  return {
    link: link
  };

});












// V2, smaller but not quite working
/*    
  function startDrag(e) {
    if(Object.keys(self).length === 0 && self.constructor === Object) {
      e=e||event;
      self.panMouseStart = {
        'horizontal': e.pageX,
        'vertical': e.pageY
      };
      self.panElStart = {
        'horizontal': parseInt(angular.element(vp).css('top'), false) || 0,
        'vertical': parseInt(angular.element(vp).css('left'), false) || 0
      };
      self.panEnd = {};
    }
  }
  function drag(e) {
    if(Object.keys(self).length > 0 && self.constructor === Object) {
      e=e||event;
      var panMouseCurrent = {
            'horizontal':self.panElStart['horizontal'],
            'vertical':self.panElStart['vertical']},
          panMouseEnd = {
            'horizontal':e.pageX,
            'vertical':e.pageY
      };
      for (var direction in self.panMouseStart) {
        pan(direction, self.panMouseStart[direction] > panMouseEnd[direction])
      }
    
      function pan(direction, mood) {
        if (mood) {
          var increment = panMouseEnd[direction] - self.panMouseStart[direction];
          panMouseCurrent[direction]+= increment;
        } else {
          var increment = self.panMouseStart[direction]; - panMouseEnd[direction];
          panMouseCurrent[direction]-= increment;
          //if (panMouseCurrent[direction] > 42) panMouseCurrent[direction] = 42;
        }
        
        angular.element(vp).css({ top: panMouseCurrent['vertical']+'px',left: panMouseCurrent['horizontal']+'px' });

      }

    }
  }
  function stopDrag(e) {
    if(Object.keys(self).length > 0 && self.constructor === Object) {
      e=e||event;
      self={};
    }
  }
*/