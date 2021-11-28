const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000
app.get("/", function (req, res) {
	res.sendFile(__dirname + "/pages/index.html");
});
var users = [];
io.on('connection', (socket) => {
	socket.on("message", message => {
		io.emit('message', message);
	})

	function newUserAdded(name) {
		var data = {
			name:name.name,
			id:socket.id
		};
		users.push(data);
		socket.broadcast.emit("newUser", name.name + " Is joined our chat app");
		io.emit("liveusers",{users:users});
	}
	socket.on("newUser", newUser => {
		socket.emit("newUser", "Welcome " + newUser.name + " to chat app");
		newUserAdded(newUser);
		io.emit("liveusers",{users:users});

	})
	
	socket.on("typing",user=>{
		io.emit("typing",user);
	})
	socket.on("shareloaction",data=>{
		io.emit("shareloaction",data);
	})
	function sendDisconnectMsg(name){
		socket.broadcast.emit("disconnected",name+" is disconnected");
		
	}
	function disconnectUser(socketid){
		for(let i = 0;i<users.length;i++){
			if(users[i].id == socketid){
				console.log(users[i].name+" is disconnected");
				sendDisconnectMsg(users[i].name);
				users.splice(i,1)
				io.emit("liveusers",{users:users});
			}
		}
	}

	socket.on('disconnect', () => {
		var socketid = socket.id;
		disconnectUser(socketid);
    })
    socket.on("image", function (msg) {
      io.emit('image',
        {
          file: msg.file,
          fileName: msg.fileName,
          name:msg.name,
          time:msg.time
        }
      );
    });


	
})


http.listen(port, () => {
	console.log("server is started on port : - "+port);
});