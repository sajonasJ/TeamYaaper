module.exports = {
    connect: function (io, PORT) {
      io.on("connection", (socket) => {
        console.log("User connected on port " + PORT + " with socket id: " + socket.id);
  
        socket.on("message", (message) => {
          console.log("Message received from client:", message);
  
          // Emit the full Message object to all clients
          io.emit("message", message);
        });
      });
    },
  };
  