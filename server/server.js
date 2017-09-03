const express = require('express');
const path = require('path');
const App = express();
var router = express.Router();
var bodyParser = require('body-parser');
var IO = require('socket.io');
const http = require('http');

var server = require('http').Server(App);

App.use(bodyParser());
App.use(express.static(path.resolve(__dirname, '../dist')));

App.get('/',function(req,res) {
  res.sendFile(path.resolve(__dirname,'../dist/index.html'));
});

var users = [];
var user = '';
var connections = [];
var socketIO = IO(server);

socketIO.on('connection', function (socket) {
  var chatUser = '';

  socket.on('join', function (userName) {

    chatUser = userName;
    if (chatUser && users.indexOf(chatUser) === -1) {
      users.push(chatUser);
      console.log(users);
    }
    connections[chatUser] = socket;

    // 通知房间内人员
    socketIO.emit('sys', chatUser + '加入了房间', users);
    console.log(chatUser + '加入了房间');
  });

  socket.on('leave', function () {
    socket.emit('disconnect');
  });

  socket.on('disconnect', function () {
    var index = users.indexOf(chatUser);
    if (index !== -1) {
      users.splice(index, 1);
    }
    user = '';
    socketIO.emit('sys', chatUser + '退出了房间');
    console.log(chatUser + '退出了');
  });

  // 接收用户消息,发送
  socket.on('public_message', function (msg) {
    if (!chatUser || users.indexOf(chatUser) === -1) {
      return false;
    }
    console.log('emitting public message by ', msg);
    socketIO.emit('msg', chatUser, msg);
  });

  socket.on('private_message', function (from,to,msg)
  {
      var target = connections[to];
      if(target)
      {
        console.log('emitting private message by ', from, ' say to ',to, msg);
        target.emit("pmsg",from,to,msg);
      }
  });

});

const port = '9999';
const url = 'http://localhost:9999';
server.listen(port,function () {
  console.log('Server is open on %s',url);
});

App.use('/', router);

router.post('/login', function(req, res) {
  var uname = req.body.uname;
  user = uname;
  var index = users.indexOf(user);
    if (index !== -1) {
      res.json(0);
      return;
    }
  users.push(user);
  console.log(users);
  res.json(1);
});