// server/newroutes/show/showJoinRequest.js
const { ObjectId } = require('mongodb');

module.exports = function (db, app) {
  app.get("/groups/:groupId/joinRequests", async (req, res) => {
    const { groupId } = req.params;

    // Check if groupId is provided
    if (!groupId) {
      return res.status(400).send({ message: "Group ID is required." });
    }

    try {
      const joinRequestsCollection = db.collection("joinRequests");
      const usersCollection = db.collection("users");

      // Convert groupId to ObjectId if needed
      let formattedGroupId;
      try {
        formattedGroupId = new ObjectId(groupId);
      } catch (error) {
        console.error("Invalid Group ID format:", groupId);
        return res.status(400).send({ message: "Invalid Group ID format." });
      }

      console.log("Searching join requests for group ID:", formattedGroupId);

      // Use aggregation to join the joinRequests and users collections
      const requests = await joinRequestsCollection.aggregate([
        {
          // Match only pending join requests for the specific groupId
          $match: {
            groupId: formattedGroupId.toString(),
            status: "pending"
          }
        },
        {
          // Convert userId to ObjectId for the lookup
          $addFields: {
            userIdObjectId: {
              $toObjectId: "$userId"
            }
          }
        },
        {
          // Lookup to get user details from the users collection
          $lookup: {
            from: "users",
            localField: "userIdObjectId",
            foreignField: "_id",
            as: "userDetails",
          }
        },
        {
          // Unwind userDetails array to extract user information
          $unwind: {
            path: "$userDetails",
            preserveNullAndEmptyArrays: false // Only keep documents with matching user details
          }
        },
        {
          // Project only the necessary fields
          $project: {
            _id: 1,
            groupId: 1,
            userId: 1,
            status: 1,
            requestedAt: 1,
            "userDetails.username": 1,
            "userDetails.firstname": 1,
            "userDetails.lastname": 1,
          }
        }
      ]).toArray();

      // Log the aggregation result
      console.log("Join requests found with user details:", requests);

      // Respond with just the array of requests (no wrapping)
      res.status(200).send(requests);
    } catch (err) {
      console.error("Error retrieving join requests:", err);
      res.status(500).send({
        message: "Internal Server Error",
        error: err.message,
      });
    }
  });
};
