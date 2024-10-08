module.exports = function (db, app) {
  app.post("/addJoinRequest", async (req, res) => {
    const { groupId, username } = req.body;

    if (!groupId || !username) {
      return res
        .status(400)
        .send({ ok: false, message: "Invalid request data: missing groupId or username." });
    }

    try {
      const joinRequestsCollection = db.collection("joinRequests");

      // Check if there's already a pending request
      const existingRequest = await joinRequestsCollection.findOne({
        groupId,
        username,
        status: "pending",
      });

      if (existingRequest) {
        return res.status(400).send({
          ok: false,
          message: "Join request already pending. Please wait for approval.",
        });
      }

      // Insert a new join request
      const result = await joinRequestsCollection.insertOne({
        groupId,
        username,
        status: "pending",
        requestedAt: new Date(),
      });

      if (result.acknowledged) {
        res
          .status(200)
          .send({ ok: true, message: "Join request submitted successfully." });
      } else {
        res
          .status(500)
          .send({ ok: false, message: "Failed to add join request." });
      }
    } catch (err) {
      console.error("Error creating join request:", err);
      res.status(500).send({
        ok: false,
        message: "An error occurred while adding the join request.",
        error: err.message,
      });
    }
  });
};
