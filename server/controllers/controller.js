/*jslint node: true */
'use strict';
var _              = require('lodash');
var throttle       = require('../util.js').throttle;
//var clientsInRoom  = require('../util.js').clientsInRoom;

function clients(io, roomname){

  var clients = [];
  var sockets = io.sockets.adapter.rooms[roomname].sockets;

  for(var socketId in sockets){
    clients.push(io.sockets.connected[socketId].username);
  }

  return clients;
};


module.exports = function(io, socket, app, state){

  return {
    onConnect: function(){
      socket.emit('update video list', app.vidList);

      if(app.vidList.length){
        socket.emit('play video', app.vidList[0]);
      }

      socket.username = 'user';
      socket.roomname = 'lobby';

      socket.join(socket.roomname);
    },

    join: function(data){

      socket.username = data.username;
      socket.roomname = data.roomname;
      socket.join(data.roomname);

      data.clients = clients(io, socket.roomname);

      io.to(socket.roomname).emit('join', data);
    },

    addVideo: function(videoId){
      if(app.vidList.length === 0){
        // to all sockets
        io.to(socket.roomname).emit('play video', videoId);
      }
      app.vidList.push(videoId);
      io.to(socket.roomname).emit('update video list', app.vidList);
    },

    pauseVideo: throttle(function(){
      io.to(socket.roomname).emit('pause video');
    }),

    resumeVideo: throttle(function(){
      io.to(socket.roomname).emit('play video');
    }),

    endVideo: throttle(function(){
      app.vidList.shift();
      if(app.vidList.length){
        io.to(socket.roomname).emit('play video', app.vidList[0]);
      }
      socket.emit('update video list', app.vidList);
    }),

    skipVideo: function(){
      state.skipVotes[socket.id] = true;
      if(Object.keys(state.skipVotes).length > io.engine.clientsCount / 2){
        console.log('skip');
        state.skipVotes = {};
        this.endVideo();
      }
    }
  };

};