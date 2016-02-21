(function(){

  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api'

  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = function(){
    
    window.player = new YT.Player('player', {
      height: '400',
      width: '600',
      playerVars: {'controls': 0},
      events: {
        'onReady': window.initialize
      }
    });
  }

})();