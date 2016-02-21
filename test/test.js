var expect = require('chai').expect;
var io = require('socket.io-client');

var app = require('../index');

var socketUrl = 'http://localhost:3000';

var options = {
  transports: ['websocket'],
  'force new connection': true
};

describe('Video Server', function () {
  var vidList = ['abc123', 'def456'];
  var client1, client2;

  beforeEach(function () {
    client1 = io.connect(socketUrl, options);
    client2 = io.connect(socketUrl, options);
  });

  afterEach(function (done) {
    app.vidList = [];
    client1.disconnect();
    client2.disconnect();
    done();
  });

  it('should respond with an video list array on connection', function (done) {

    client1.on('update video list', function(list){
      expect(list).to.eql([]);
      done();
    });

  });

  it('should only respond with an video list array on connection to the connecting user', function (done) {
    var event = 0;
    var client3;

    client3 = io.connect(socketUrl, options);
    client3.on('connect', function(){
      setTimeout(function(){
        expect(event).to.equal(1);
        client3.disconnect();
        done();
      }, 50);
    });

    client1.on('connect', function(){
      client1.on('update video list', function(list){
        event++;
      });
    });

  });

  it('should start playing the first video on connection', function (done) {
    var client3;

    client1.on('connect', function(){
      client1.emit('add video', vidList[0]);

      client3 = io.connect(socketUrl, options);
      client3.on('play video', function(videoId){
        expect(videoId).to.equal(vidList[0]);
        client3.disconnect();
        done();
      });
    });

  });

  it('should broadcast the updated video list when a new video is added', function (done) {
    var event = 0;
    
    client1.on('connect', function(){
      client1.on('update video list', function(list){
        if(event === 0){
          expect(list).to.eql([]);
        }
        if(event === 1){
          expect(list).to.eql(['abc123']);
          done();
        }
        event++;
      });
      client1.emit('add video', vidList[0]);
    });
  });

  it('should broadcast the updated video list when a new video is added to all users', function (done) {
    var event = 0;

    client1.on('connect', function(){

      client2.on('connect', function(){

        client2.on('update video list', function(list){
          if(event === 0){
            expect(list).to.eql([]);
          }
          if(event === 1){
            expect(list).to.eql(['def456']);
            done();
          }
          event++;
        });

        client1.emit('add video', vidList[1]);
      });
    });
  });

  it('should play video if added video is the first video', function (done) {
    var event = 0;
    
    client1.on('connect', function(){
      client1.on('play video', function(videoId){
        expect(videoId).to.equal(vidList[0]);
        done();
      });
      client1.emit('add video', vidList[0]);
    });
  });

  it('should send an updated vid list on a video end event', function (done) {
    var event = 0;
    
    client1.on('connect', function(){
      client1.emit('add video', vidList[0]);
      client1.emit('add video', vidList[1]);

      // 4 update video list events, connection, 2 updates, and end video
      client1.on('update video list', function(list){
        if(event === 3){
          expect(list).to.eql(['def456']);
          done();
        }
        event++;
      });

      client1.emit('end video');
    });
  });

  it('should play the next video after a video end event', function (done) {
    var event = 0;

    client1.on('connect', function(){
      client1.emit('add video', vidList[0]);
      client1.emit('add video', vidList[1]);

      client1.on('play video', function(videoId){
        if(event === 1){
          expect(videoId).to.equal('def456');
          done();
        }
        event++;
      });

      client1.emit('end video');
    });
  });

  it('should only recieve one play video event', function (done) {
    var event = 0;

    client1.on('connect', function(){
      client1.emit('add video', vidList[0]);
      client1.emit('add video', vidList[1]);

      client1.on('play video', function(videoId){
        event++;
      });

      client1.emit('end video');
      client2.emit('end video');
    });

    setTimeout(function(){
      expect(event).to.equal(2);
      done();
    }, 50);
  });

  it('should pause a video for all users', function (done) {

    client2.on('pause video', function(){
      done();
    });

    client1.emit('pause video');
  });

  it('should resume a video for all users', function (done) {
    client2.on('play video', function(videoId){
      expect(videoId).to.equal(undefined);
      done();
    });

    client1.emit('resume video');
  });

});