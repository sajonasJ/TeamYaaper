// C:\Users\jonas\Code\prog_repos\TeamYaaper\server\newroutes\show\showAllUsers.js

module.exports = function (db, app) {
  app.get("/allUsers", async (req, res) => {
    try {
      const usersCollection = db.collection("users");
      const allUsers = await usersCollection.find({}).toArray();

      if (!allUsers.length) {
        return res.status(404).send({ message: "No users found" });
      }

      res.status(200).send(allUsers);
    } catch (err) {
      console.error("Error fetching all users:", err);
      res.status(500).send({ message: "An error occurred while fetching all users" });
    }
  });
};
