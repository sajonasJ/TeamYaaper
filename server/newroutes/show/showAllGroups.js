// server/newroutes/showAllGroups.js

module.exports = function (db, app) {
  // Fetch All Groups
  app.get("/allGroups", async (req, res) => {
    try {
      const groupsCollection = db.collection("groups");
      const allGroups = await groupsCollection.find({}).toArray();
      res.status(200).send(allGroups);
    } catch (err) {
      console.error("Error fetching all groups:", err);
      res
        .status(500)
        .send({ message: "An error occurred while fetching all groups" });
    }
  });
};
