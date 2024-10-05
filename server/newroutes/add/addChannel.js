// server/newroutes/add/addChannel.js
module.exports = function (db, app) {
    app.post("/groups/:groupId/channels", async (req, res) => {
      try {
        const groupId = req.params.groupId;
        const newChannel = req.body;
  
        const groupsCollection = db.collection("groups");
        const result = await groupsCollection.findOneAndUpdate(
          { _id: groupId },
          { $push: { channels: newChannel } },
          { returnOriginal: false }
        );
  
        if (result.value) {
          res.status(200).send(result.value);
        } else {
          res.status(404).send({ message: "Group not found" });
        }
      } catch (err) {
        console.error("Error adding channel to group:", err);
        res.status(500).send({ message: "Failed to add channel to group" });
      }
    });
  };
  