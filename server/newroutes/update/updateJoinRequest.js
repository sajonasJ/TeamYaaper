const { ObjectId } = require("mongodb");

module.exports = function (db, app) {
  app.post("/updateJoinRequest", async (req, res) => {
    const { requestId, status } = req.body;

    if (!requestId || !["approved", "rejected"].includes(status)) {
      return res.status(400).send({ ok: false, message: "Invalid request data" });
    }

    try {
      const joinRequestsCollection = db.collection("joinRequests");
      const usersCollection = db.collection("users");
      const objectId = new ObjectId(requestId);

      const updateResult = await joinRequestsCollection.updateOne(
        { _id: objectId },
        { $set: { status } }
      );

      console.log(`Update result for join request:`, updateResult);

      if (status === "approved") {
        // Fetch the updated join request
        const updatedRequest = await joinRequestsCollection.findOne({ _id: objectId });
        if (!updatedRequest) {
          return res.status(404).send({ ok: false, message: "Join request not found." });
        }

        // Fetch the user details from the users collection based on `username`
        const user = await usersCollection.findOne({ username: updatedRequest.username });
        if (!user) {
          return res.status(404).send({ ok: false, message: "User not found." });
        }

        // Add the username to the group's users array
        const groupCollection = db.collection("groups");
        const addUserResult = await groupCollection.updateOne(
          { _id: new ObjectId(updatedRequest.groupId) },
          { $addToSet: { users: user.username } }
        );

        console.log(`Added user ${user.username} to the group.`);
      }

      res.status(200).send({ ok: true, message: `Join request ${status} successfully` });
    } catch (err) {
      console.error("Error updating join request:", err);
      res.status(500).send({ ok: false, message: "Internal Server Error" });
    }
  });
};
