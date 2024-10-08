module.exports= {
    connect: function(io, PORT){
        io.on('connection',(socket)=>{
            // when a connection request come in output to the server console
            console.log('user connection on port '+ PORT + ':' + socket.id);

            // when a message comes in emit it back to all sockets with the message
            socket.on('message',(message)=>{
                io.emit('message', message);
            })

        })
    }
}