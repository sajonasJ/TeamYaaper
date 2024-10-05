// server/newroutes/showGroupById.js

const { ObjectId } = require("mongodb");

module.exports = function (db, app) {
  // Fetch a Specific Group by ID
  app.get("/groups/:id", async (req, res) => {
    try {
      const groupId = req.params.id;
      const groupsCollection = db.collection("groups");

      // Convert groupId to an ObjectId
      const group = await groupsCollection.findOne({
        _id: new ObjectId(groupId),
      });

      if (!group) {
        return res.status(404).send({ message: "Group not found" });
      }

      res.status(200).send(group);
    } catch (err) {
      console.error("Error fetching group by ID:", err);
      res
        .status(500)
        .send({ message: "An error occurred while fetching the group" });
    }
  });
};
