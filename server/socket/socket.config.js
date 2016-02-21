/*jslint node: true */
'use strict';

function throttle(func){
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

var socketConfig = function(io, socket, app, state){

  var obj = {};

  obj.votes = 0;

  obj.onConnect = function(){

    socket.emit('update video list', app.vidList);

    if(app.vidList.length){
      socket.emit('play video', app.vidList[0]);
    }
  };

  obj.addVideo = function(videoId){
    if(app.vidList.length === 0){
      // to all sockets
      io.sockets.emit('play video', videoId);
    }
    app.vidList.push(videoId);
    io.sockets.emit('update video list', app.vidList);
  };

  obj.pauseVideo = throttle(function(){
    io.sockets.emit('pause video');
  });

  obj.resumeVideo = throttle(function(){
    io.sockets.emit('play video');
  });

  obj.endVideo = throttle(function(){
    app.vidList.shift();
    if(app.vidList.length){
      io.sockets.emit('play video', app.vidList[0]);
    }
    socket.emit('update video list', app.vidList);
  });

  obj.skipVideo = function(){
    state.skipVotes[socket.id] = true;

    console.log(Object.keys(state.skipVotes).length, io.engine.clientsCount);
    if(Object.keys(state.skipVotes).length > io.engine.clientsCount / 2){
      console.log('skip');
      state.skipVotes = {};
      obj.endVideo();
    }
  }

  return obj;
}

module.exports = function(app, io){

  app.vidList = [];

  var state = {
    skipVotes: {}
  }

  io.sockets.on('connection', function(socket){

    var socketObj = socketConfig(io, socket, app, state);

    socketObj.onConnect();

    socket.on('add video', socketObj.addVideo);
    socket.on('pause video', socketObj.pauseVideo);
    socket.on('resume video', socketObj.resumeVideo);
    socket.on('skip video', socketObj.skipVideo);
    socket.on('end video', socketObj.endVideo);

  });

};