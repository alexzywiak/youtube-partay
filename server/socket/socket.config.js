/*jslint node: true */
'use strict';

module.exports = function(app, io){

  app.vidList = [];

  var state = {
    skipVotes: {}
  };

  io.sockets.on('connection', function(socket){

    var socketObj = require('../controllers/controller')(io, socket, app, state);

    socketObj.onConnect();

    socket.on('join', socketObj.join);

    socket.on('add video',    socketObj.addVideo);
    socket.on('pause video',  socketObj.pauseVideo);
    socket.on('resume video', socketObj.resumeVideo);
    socket.on('skip video',   socketObj.skipVideo);
    socket.on('end video',    socketObj.endVideo);

  });

};