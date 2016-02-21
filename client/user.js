var User = function(app, userData){
  this.app      = app;
  this.username = userData.username;
  this.roomname = userData.roomname;

  this.initialize();
};

User.prototype.initialize = function(){

};
