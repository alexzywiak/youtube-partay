window.initialize = function(){

  var socket = io();
  var player = window.player

  var app = new YTApp(player, socket);

  app.initialize();
}