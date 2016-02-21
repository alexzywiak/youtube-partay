var AppView = function(YTApp){
  this.app = YTApp;

  this.$el       = $('#app');
  this.$vidList  = $('#vid-list');
  this.$vidForm  = $('#app form');
  this.$idInput  = $('#m');
  this.$controls = $('#controls');
  
  this.initialize();
};

AppView.prototype.initialize = function(){
   // Setup jQuery events
   this.$vidForm.on('submit', this.onVidFormSubmit.bind(this));
   this.$controls.on('click', this.onVideoControls.bind(this));
};

// jQuery Methods
AppView.prototype.onVidFormSubmit = function(evt){
  evt.preventDefault();
  var id = this.$idInput.val();
  this.$idInput.val('');
  this.app.handle('add video', id);
};

AppView.prototype.onVideoControls = function(evt){
  this.app.handle('video controls', $(evt.target).data('action'));
};

AppView.prototype.updateVideoList = function(vidList){
  this.$vidList.html(vidList.map(function(videoId){
    return $('<li>').text(videoId).data('videoId', videoId);
  }));
};