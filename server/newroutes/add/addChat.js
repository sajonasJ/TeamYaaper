// File: addChat.js

module.exports = function (db, app) {
  // Endpoint to add a new chat message to a channel in a group
  app.post("/addChat", async (req, res) => {
    if (
      !req.body ||
      !req.body.groupId ||
      !req.body.channelId ||
      !req.body.message
    ) {
      return res
        .status(400)
        .send({
          message:
            "Invalid request. Group ID, Channel ID, and message are required.",
        });
    }

    const { groupId, channelId, message } = req.body;

    try {
      // Connect to the "groups" collection in the database
      const groupsCollection = db.collection("groups");

      // Create a message object with the required details
      const newMessage = {
        senderId: message.senderId, // ID of the sender
        name: message.name, // Sender's name (could be username or real name)
        text: message.text, // The chat message
        timestamp: new Date(), // Set the timestamp to the current date and time
      };

      // Find the specific group and update the specified channel
      const result = await groupsCollection.updateOne(
        {
          _id: new ObjectId(groupId), // Match the specific group by its ID
          "channels.id": channelId, // Match the specific channel within the group by its ID
        },
        {
          $push: { "channels.$.messages": newMessage }, // Push the new message to the "messages" array of the matched channel
        }
      );

      // Check if the update was successful
      if (result.modifiedCount === 1) {
        res.status(200).send({ message: "Chat message added successfully" });
      } else {
        res
          .status(404)
          .send({
            message: "Group or Channel not found. Unable to add message.",
          });
      }
    } catch (error) {
      console.error("Error adding chat message:", error);
      res
        .status(500)
        .send({ message: "An error occurred while adding the chat message" });
    }
  });
};
