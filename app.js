var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

  var searching = {};

//test

app.listen(process.env.PORT || 5000);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {


	socket.on('message', function (data)
	{
        console.log("message");
		for (var room in io.nsps["/"].adapter.rooms[socket.id])
		{
            console.log()
			if (room!="")
			{

				room=room.substring(1, room.length)
				console.log(room);
                io.to('some room').emit('receive', data);
			}
		}
	})

  socket.on('find', function (data) {

	searching[socket.id]=socket

	found="";
    console.log("Socketid:" + socket.id);
	for(var client in searching)
    {
		if (client!=socket.id)
		{
			found=searching[client]
            console.log("found: " + found);
			break
		}

		//socket.join(clients[i].id)

	}
	if (found!="")
	{
		 socket.emit('found', { friend: found.id});
		 found.emit('found',  { friend: socket.id});
		socket.join(socket.id)
		found.join(socket.id)
		 delete searching[socket.id];
		 delete searching[found.id];

	}
	else
	{
		socket.emit('found', {friend: 'none'});
	}

  });



});
