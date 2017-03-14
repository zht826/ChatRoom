var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/html/', function(req, res) {
	res.sendfile('/index.html', {root: __dirname + '/html' });
});

app.use('/html', express.static(__dirname + '/html'));

//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;
var onlineId;
io.on('connection', function(socket){
	//监听新用户加入
	socket.on('login', function(obj){
		//检查在线列表，如果不在里面就加入
		if(!onlineUsers.hasOwnProperty(obj.username)) {
            //将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
            socket.name = obj.username;
			onlineUsers[obj.username] = obj.username;
			//在线人数+1
			onlineCount++;
			//向所有客户端广播用户加入
			socket.emit('login', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
            socket.broadcast.emit("otherLogin",{onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
            console.log(obj.username+'加入了聊天室');
		}else{
            socket.emit('alertError','昵称已存在,请重新输入!');
            console.log('昵称重复!');
		}
	});
	//监听用户退出
	socket.on('disconnect', function(){
		console.log(socket.name);
		//将退出的用户从在线列表中删除
		if(onlineUsers.hasOwnProperty(socket.name)) {
			//退出用户的信息
			var obj = {userid:socket.name, username:onlineUsers[socket.name]};
			
			//删除
			delete onlineUsers[socket.name];
			//在线人数-1
			onlineCount--;
			
			//向所有客户端广播用户退出
			io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
			console.log(obj.username+'退出了聊天室');
		}
	});
	
	//监听用户发布聊天内容
	socket.on('message', function(obj){
		//向所有客户端广播发布的消息
		io.emit('message', obj);
		console.log(obj);
	});
  
});

http.listen(3030, function(){
	console.log('listening on *:3030');
});