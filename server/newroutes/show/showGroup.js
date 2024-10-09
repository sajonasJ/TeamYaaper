//C:\Users\jonas\Code\prog_repos\TeamYaaper\server\newroutes\show\showGroup.js

const { ObjectId } = require("mongodb");

module.exports = function (db, app) {
  app.get("/groups/:id", async (req, res) => {
    try {
      const groupId = req.params.id;
      const groupsCollection = db.collection("groups");

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
