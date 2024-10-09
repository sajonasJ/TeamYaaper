// File: deleteChannel.js

const { ObjectId } = require("mongodb");

module.exports = function (db, app) {

  app.delete("/deleteChannel", async (req, res) => {
    if (!req.body || !req.body.groupId || !req.body.channelId) {
      return res
        .status(400)
        .send({
          message: "Invalid request. Group ID and Channel ID are required.",
        });
    }

    const { groupId, channelId } = req.body;

    try {
      const groupsCollection = db.collection("groups");

      const result = await groupsCollection.updateOne(
        { _id: new ObjectId(groupId) },
        { $pull: { channels: { id: channelId } } }
      );

      if (result.modifiedCount === 1) {
        res.status(200).send({ message: "Channel deleted successfully" });
      } else {
        res
          .status(404)
          .send({ message: "Group or Channel not found. Unable to delete." });
      }
    } catch (error) {
      console.error("Error deleting channel:", error);
      res
        .status(500)
        .send({ message: "An error occurred while deleting the channel" });
    }
  });
};
