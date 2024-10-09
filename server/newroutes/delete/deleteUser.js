// server/newroutes/delete/deleteUser.js

module.exports = function (db, app) {
  app.delete("/users/:username", async (req, res) => {
    const username = req.params.username;

    try {
      const usersCollection = db.collection("users");
      const result = await usersCollection.deleteOne({ username });

      if (result.deletedCount === 0) {
        return res.status(404).send({ message: "User not found" });
      }

      res.status(200).send({ message: "User deleted successfully" });
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });
};
