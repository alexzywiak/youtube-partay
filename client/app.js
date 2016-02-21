
var YTApp = function(player, socket){

  this.player       = player;
  this.socket       = socket;
  
  this.landingView  = new LandingView(this);
  this.appView      = new AppView(this);
  this.handlers     = {};
  this.user         = {};
};

YTApp.prototype.initialize = function(){

  // Set up video player events
  this.player = configurePlayer(this.player, {
    ended   : this.socket.emit.bind(this.socket, 'end video'),
    paused  : this.socket.emit.bind(this.socket, 'pause video'),
    playing : this.socket.emit.bind(this.socket, 'resume video')
  });

  // Set up Socket Events
  this.socket.on('play video',        this.playVideo.bind(this));
  this.socket.on('pause video',       this.pauseVideo.bind(this));
  this.socket.on('update video list', this.updateVideoList.bind(this));

  // Set up View Events
  this.handlers = {
    'landing view submit': this.handleLandingViewSubmit.bind(this),
    'add video'          : this.handleAddVideo.bind(this),
    'video controls'     : this.handleVideoControls.bind(this)
  };
};

YTApp.prototype.handle = function(event, data){
  if(this.handlers[event]){
    this.handlers[event](data);
  } else {
    return;
  }
};

// View Event Handlers
YTApp.prototype.handleLandingViewSubmit = function(data){
  this.landingView.$el.hide();
  this.appView.$el.show();


};

YTApp.prototype.handleAddVideo = function(videoId){
  this.socket.emit('add video', videoId);
};

YTApp.prototype.handleVideoControls = function(action){
  this.socket.emit(action);
};

// Socket Event Methods
YTApp.prototype.playVideo = function(videoId){
  if(videoId){
    this.player.loadVideoById(videoId);
  }
  this.player.playVideo();
};

YTApp.prototype.pauseVideo = function(){
  this.player.pauseVideo();
};

YTApp.prototype.updateVideoList = function(vidList){
  this.appView.updateVideoList(vidList);
};

