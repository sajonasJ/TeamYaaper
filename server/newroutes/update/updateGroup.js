const { ObjectId } = require("mongodb");

module.exports = function (db, app) {
  // Update a Specific Group
  app.put("/allGroups/:id", async (req, res) => {
    if (!req.body) {
      return res.status(400).send({ message: "Bad request, no data provided" });
    }

    const groupId = req.params.id;

    // Check if groupId is a valid ObjectId
    if (!ObjectId.isValid(groupId)) {
      return res.status(400).send({ message: "Invalid group ID" });
    }

    const updatedGroup = req.body;

    // Remove _id if present in the payload
    delete updatedGroup._id;

    try {
      const groupsCollection = db.collection("groups");

      // Log the payload for debugging purposes
      console.log("Payload received for updating group:", updatedGroup);

      // Update the group document by ID
      const result = await groupsCollection.updateOne(
        { _id: new ObjectId(groupId) },
        { $set: updatedGroup }
      );

      if (result.matchedCount === 0) {
        return res.status(404).send({ message: "Group not found" });
      }

      res.status(200).send({ message: "Group updated successfully" });
    } catch (err) {
      console.error("Error updating group:", err);
      res
        .status(500)
        .send({ message: "An error occurred while updating the group" });
    }
  });
};
