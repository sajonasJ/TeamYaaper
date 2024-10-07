const { ObjectId } = require("mongodb");

module.exports = function (db, app) {
  // Endpoint to update a specific user's information by user ID
  app.put("/updateUser/:userId", async (req, res) => {
    const userId = req.params.userId;
    const updatedUserData = req.body;

    // Validate the provided user ID
    if (!ObjectId.isValid(userId)) {
      return res.status(400).send({ message: "Invalid User ID." });
    }

    try {
      const usersCollection = db.collection("users");

      const updateFields = {};
      if (updatedUserData.username) {
        updateFields.username = updatedUserData.username;
      }
      if (updatedUserData.email) {
        updateFields.email = updatedUserData.email;
      }
      if (updatedUserData.firstname) {
        updateFields.firstname = updatedUserData.firstname;
      }
      if (updatedUserData.lastname) {
        updateFields.lastname = updatedUserData.lastname;
      }
      if (updatedUserData.roles) {
        updateFields.roles = updatedUserData.roles;
      }
      if (updatedUserData.groups) {
        updateFields.groups = updatedUserData.groups;
      }

      const result = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateFields }
      );

      if (result.modifiedCount === 1) {
        res
          .status(200)
          .send({ ok: true, message: "User updated successfully" });
      } else {
        res
          .status(404)
          .send({ ok: false, message: "User not found. Unable to update." });
      }
    } catch (error) {
      res
        .status(500)
        .send({ message: "An error occurred while updating the user." });
    }
  });
};
