window.initialize = function(){

  var socket = io();
  var vidList = [];
  
  var $vidList = $('#vid-list');
  var $vidForm = $('form');
  var $idInput = $('#m');
  var $controls = $('#controls');
  
  $vidForm.on('submit', function(e){
    e.preventDefault();
    var id = $idInput.val();
    $idInput.val('');
    socket.emit('add video', id);
  });

  $controls.on('click', function(evt){
    socket.emit($(evt.target).data('action'));
  });

  window.player = configurePlayer(window.player, {
    ended: handleVideoEnd,
    paused: handleVideoPause,
    playing: handleVideoResume
  });

  function handleVideoEnd(){
    socket.emit('end video');
  }

  function handleVideoPause(){
    socket.emit('pause video');
  }

  function handleVideoResume(){
    socket.emit('resume video');
  }

  socket.on('play video', playVideo);
  socket.on('pause video', pauseVideo);
  socket.on('update video list', updateVideoList);

  function playVideo(videoId){
    if(videoId){
      window.player.loadVideoById(videoId);
    }
    window.player.playVideo();
  }

  function pauseVideo(){
    window.player.pauseVideo();
  }

  function updateVideoList(vidList){
    $vidList.html(vidList.map(function(videoId){
      return $('<li>').text(videoId).data('videoId', videoId);
    }));
  }
}
