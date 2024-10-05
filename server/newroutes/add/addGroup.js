// server/newroutes/add/addGroup.js

module.exports = function (db, app) {
  // Add a New Group
  app.post("/groups", async (req, res) => {
    if (!req.body) {
      return res.sendStatus(400);
    }

    const {
      name,
      description,
      admins = [],
      users = [],
      channels = [],
    } = req.body;

    try {
      const groupsCollection = db.collection("groups");

      // Construct the new group object
      const newGroup = {
        name,
        description,
        admins,
        users,
        channels,
        createdAt: new Date(),
      };

      // Insert the new group into the database
      const result = await groupsCollection.insertOne(newGroup);

      if (result.insertedCount === 1) {
        res
          .status(201)
          .send({
            ok: true,
            message: "Group added successfully",
            group: newGroup,
          });
      } else {
        res.status(500).send({ ok: false, message: "Failed to add group" });
      }
    } catch (err) {
      console.error("Error adding new group:", err);
      res
        .status(500)
        .send({
          ok: false,
          message: "An error occurred while adding the group",
        });
    }
  });
};
