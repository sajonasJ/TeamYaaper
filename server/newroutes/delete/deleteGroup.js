// File: deleteGroup.js

const { ObjectId } = require("mongodb");

module.exports = function (db, app) {

  app.delete("/deleteGroup/:groupId", async (req, res) => {
    const groupId = req.params.groupId;

    if (!ObjectId.isValid(groupId)) {
      return res.status(400).send({ message: "Invalid Group ID." });
    }

    try {
      const groupsCollection = db.collection("groups");

      const result = await groupsCollection.deleteOne({
        _id: new ObjectId(groupId),
      });

      if (result.deletedCount === 1) {
        res.status(200).send({ message: "Group deleted successfully" });
      } else {
        res.status(404).send({ message: "Group not found. Unable to delete." });
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      res
        .status(500)
        .send({ message: "An error occurred while deleting the group" });
    }
  });
};
