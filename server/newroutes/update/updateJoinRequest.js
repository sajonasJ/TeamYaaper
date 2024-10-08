// server/newroutes/update/updateJoinRequest.js

const { ObjectId } = require('mongodb');

// server/newroutes/update/updateJoinRequest.js
module.exports = function (db, app) {
  // Update the route to handle join request updates
  app.post("/updateJoinRequest", async (req, res) => {
    const { requestId, status } = req.body;

    // Validate request data
    if (!requestId || !["approved", "rejected"].includes(status)) {
      return res.status(400).send({ ok: false, message: "Invalid request data" });
    }

    try {
      // Ensure the requestId is correctly converted to ObjectId
      const joinRequestsCollection = db.collection("joinRequests");
      const objectId = new ObjectId(requestId);

      // Update the join request's status in the database
      const updateResult = await joinRequestsCollection.updateOne(
        { _id: objectId },
        { $set: { status } }
      );

      console.log(`Update result for join request:`, updateResult);

      // If the request was approved, add the user to the group
      if (status === "approved") {
        // Find the updated request to retrieve group and user IDs
        const updatedRequest = await joinRequestsCollection.findOne({
          _id: objectId,
        });

        if (!updatedRequest) {
          console.log(`Join request not found with ID: ${requestId}`);
          return res.status(404).send({ ok: false, message: "Join request not found" });
        }

        // Log updated request details
        console.log(`Updated join request:`, updatedRequest);

        // Add the user to the group members
        const groupCollection = db.collection("groups");
        const addUserResult = await groupCollection.updateOne(
          { _id: new ObjectId(updatedRequest.groupId) },
          { $addToSet: { users: updatedRequest.userId } }
        );

        // Log result of adding user to group
        console.log(`Add user to group result:`, addUserResult);
      }

      // Respond with a success message
      res.status(200).send({ ok: true, message: `Join request ${status} successfully` });
    } catch (err) {
      // Log and send error response
      console.error("Error updating join request:", err);
      res.status(500).send({ ok: false, message: "Internal Server Error" });
    }
  });
};

