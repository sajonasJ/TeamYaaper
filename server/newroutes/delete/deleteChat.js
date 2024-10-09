// File: deleteChat.js

const { ObjectId } = require("mongodb");

module.exports = function (db, app) {
  app.delete("/deleteChat", async (req, res) => {
    if (
      !req.body ||
      !req.body.groupId ||
      !req.body.channelId ||
      !req.body.messageId
    ) {
      return res
        .status(400)
        .send({
          message:
            "Invalid request. Group ID, Channel ID, and Message ID are required.",
        });
    }

    const { groupId, channelId, messageId } = req.body;

    try {
      const groupsCollection = db.collection("groups");

      const result = await groupsCollection.updateOne(
        { _id: new ObjectId(groupId), "channels.id": channelId },
        { $pull: { "channels.$.messages": { id: messageId } } }
      );

      if (result.modifiedCount === 1) {
        res.status(200).send({ message: "Chat message deleted successfully" });
      } else {
        res
          .status(404)
          .send({
            message: "Group, Channel, or Message not found. Unable to delete.",
          });
      }
    } catch (error) {
      console.error("Error deleting chat message:", error);
      res
        .status(500)
        .send({ message: "An error occurred while deleting the chat message" });
    }
  });
};
