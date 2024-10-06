// C:\Users\jonas\Code\prog_repos\TeamYaaper\server\newroutes\show\showUser.js

module.exports = function (db, app) {
  app.get("/users", async (req, res) => {
    const { username } = req.query;

    if (!username) {
      return res
        .status(400)
        .send({ ok: false, message: "Username is required" });
    }

    try {
      const usersCollection = db.collection("users");
      const user = await usersCollection.findOne({ username: username });

      if (!user) {
        return res.status(404).send({ ok: false, message: "User not found" });
      }

      // Send user data excluding sensitive information
      const { passwordHash, ...userData } = user;
      res.status(200).send(userData);
    } catch (err) {
      console.error("Error fetching user", err);
      res.status(500).send({ ok: false, message: "Internal Server Error" });
    }
  });
};
