// server/newroutes/add/addGroup.js
module.exports = function (db, app) {
  app.post("/groups/add", async (req, res) => {
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


      const newGroup = {
        name,
        description,
        admins,
        users,
        channels,
        createdAt: new Date(),
      };


      const result = await groupsCollection.insertOne(newGroup);

      if (result.acknowledged) {

        const insertedGroup = {
          ...newGroup,
          _id: result.insertedId,
        };

        res.status(201).send({
          ok: true,
          message: "Group added successfully",
          group: insertedGroup,
        });
      } else {
        res.status(500).send({ ok: false, message: "Failed to add group" });
      }
    } catch (err) {
      console.error("Error adding new group:", err);
      res.status(500).send({
        ok: false,
        message: "An error occurred while adding the group",
        error: err.message,
      });
    }
  });
};
