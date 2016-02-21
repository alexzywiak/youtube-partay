/*jslint node: true */
'use strict';

module.exports = {
  throttle: function(func){
    var firstEvent = true;

    return function(){
      if(firstEvent){
        firstEvent = false;
        func();
        setTimeout(function(){
          firstEvent = true;
        }, 300);
      }
    };
  }
};