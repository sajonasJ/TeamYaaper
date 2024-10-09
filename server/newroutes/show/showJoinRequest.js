const { ObjectId } = require("mongodb");

module.exports = function (db, app) {
  app.get("/groups/:groupId/joinRequests", async (req, res) => {
    const { groupId } = req.params;

    if (!groupId) {
      return res.status(400).send({ message: "Group ID is required." });
    }

    try {
      const joinRequestsCollection = db.collection("joinRequests");
      const usersCollection = db.collection("users");

      let formattedGroupId;
      try {
        formattedGroupId = new ObjectId(groupId);
      } catch (error) {
        console.error("Invalid Group ID format:", groupId);
        return res.status(400).send({ message: "Invalid Group ID format." });
      }

      console.log("Searching join requests for group ID:", formattedGroupId);

      //Use MongoDB's aggregate() function to perform an aggregation on the joinRequests collection:
      const requests = await joinRequestsCollection
        .aggregate([
          {
            //$match: Filters documents where groupId matches and status is "pending".
            $match: {
              groupId: formattedGroupId.toString(),
              status: "pending",
            },
          },
          {
            //$lookup: Joins the users collection on username to fetch details about the user who made the join request.
            $lookup: {
              from: "users",
              localField: "username",
              foreignField: "username",
              as: "userDetails",
            },
          },
          {
            //$unwind: Ensures that only join requests with matching user details are returned.
            $unwind: {
              path: "$userDetails",
              preserveNullAndEmptyArrays: false,
            },
          },
          {
            //$project: Selects specific fields to include in the response (group and user info).
            $project: {
              _id: 1,
              groupId: 1,
              username: 1,
              status: 1,
              requestedAt: 1,
              "userDetails.username": 1,
              "userDetails.firstname": 1,
              "userDetails.lastname": 1,
            },
          },
        ])
        .toArray();

      console.log("Join requests found with user details:", requests);

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
