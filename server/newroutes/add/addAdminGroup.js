// server/newroutes/add/addAdminGroup.js

module.exports = function (db, app) {
  app.put("/groups/:id/admin", async (req, res) => {
    const groupId = req.params.id;
    const { username } = req.body;

    try {
      const groupsCollection = db.collection("groups");
      const userExists = await groupsCollection.findOne({
        _id: new ObjectId(groupId),
      });

      if (!userExists) {
        return res.status(404).send({ message: "Group not found" });
      }

      // Add the new admin if not already in the list
      if (!userExists.admins.includes(username)) {
        await groupsCollection.updateOne(
          { _id: new ObjectId(groupId) },
          { $push: { admins: username } }
        );
        res.status(200).send({ message: "Admin added successfully" });
      } else {
        res.status(400).send({ message: "Admin already exists in group" });
      }
    } catch (err) {
      console.error("Error adding admin to group:", err);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });
};
