var LandingView = function(YTApp){
  this.app = YTApp;

  this.$el = $('#landing');
  this.$landingForm = $('#landing form');
  this.$username = $('#username');

  this.initialize();
};

LandingView.prototype.initialize = function(){
  this.$landingForm.on('submit', this.handleSubmit.bind(this));
};

LandingView.prototype.handleSubmit = function(evt){
  evt.preventDefault();
  this.app.handle('landing view submit', {username: this.$username.val()});
};