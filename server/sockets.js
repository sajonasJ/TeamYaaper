const { ObjectId } = require("mongodb");

module.exports = {
  connect: function (io, PORT, db) {
    io.on("connection", (socket) => {
      console.log(
        "User connected on port " + PORT + " with socket id: " + socket.id
      );

      socket.on("message", async (message) => {
        console.log("Message received from client:", message);

        const messageToSave = {
          userId: new ObjectId(message.userId),
          name:message.name,
          text: message.text,
          timestamp: new Date(),
        };

        // Emit the message to all clients
        io.emit("message", message);

        try {
          const groupId = new ObjectId(message.groupId);
          const channelName = message.channelName;

          const result = await db.collection("groups").updateOne(
            { _id: groupId, "channels.name": channelName },
            { $push: { "channels.$.messages": messageToSave } }
          );

          if (result.modifiedCount > 0) {
            console.log("Message saved to the group/channel in MongoDB");
          } else {
            console.error(
              "Message not saved. Group or channel might not exist."
            );
          }
        } catch (error) {
          console.error("Error saving message to MongoDB:", error);
        }
      });
    });
  },
};
