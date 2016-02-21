window.configurePlayer = function(player, options){

  player.addEventListener('onStateChange', function(){
    
    switch(player.getPlayerState()){
      // unstarted
      case -1:
      if(options.unstarted){
        options.unstarted();
      }
      break
      // ended
      case 0:
      if(options.ended){
        options.ended();
      }
      break
      // playing
      case 1:
      if(options.playing){
        options.playing();
      }
      break
      // paused
      case 2:
      if(options.paused){
        options.paused();
      }
      break
      // buffering
      case 3:
      if(options.buffering){
        options.buffering();
      }
      break
      // video cued
      case 5:
      if(options.videoCued){
        options.videoCued();
      }
      break
    }
  });

  return player;
};