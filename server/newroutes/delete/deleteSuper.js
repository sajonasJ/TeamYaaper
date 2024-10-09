// server/newroutes/delete/deleteSuper.js

module.exports = function (db, app) {
  app.put("/users/:username/removeSuper", async (req, res) => {
    const username = req.params.username;

    try {
      const usersCollection = db.collection("users");
      const user = await usersCollection.findOne({ username });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      if (user.roles.includes("super")) {
        await usersCollection.updateOne(
          { username },
          { $pull: { roles: "super" } }
        );
        res.status(200).send({ message: "Super role removed successfully" });
      } else {
        res.status(400).send({ message: "User is not a SuperUser" });
      }
    } catch (err) {
      console.error("Error removing super role:", err);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });
};
