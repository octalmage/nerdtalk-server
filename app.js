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

io.on("connection", function(socket)
{

    socket.on("find", function(msg)
    {
        var found="";
        
        //Store client in searching list.
        searching[socket.id]=socket;
        
	    for(var client in searching)
        {
		    if (client!=socket.id)
		    {
			    found=searching[client]
                console.log("found: " + client);
			    break
		    }
	   }
       
        if (found!="")
	    {
		    socket.emit("found", { friend: found.id});
    		found.emit("found",  { friend: socket.id});
            
    		socket.join(socket.id);
    		found.join(socket.id);
            socket.join(found.id);
    		found.join(found.id);
            
            delete searching[socket.id];
            delete searching[found.id];
        }
    });
    
    
    socket.on("chat message", function(msg)
    {
        socket.broadcast.to(socket.id).emit('receive', msg);
        //console.log(io.sockets.adapter.rooms[socket.id]);
        console.log('message: ' + msg);
    });
  
  
});

function count()
{
    var i=0;
    for (var client in searching)
    {
        i++;
    }
    return i;
}


