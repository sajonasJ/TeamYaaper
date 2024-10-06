//C:\Users\jonas\Code\prog_repos\TeamYaaper\server\newroutes\show\verify.js
const bcrypt = require("bcrypt");

module.exports = function (db, app) {
  app.post("/verify", async (req, res) => {

    if (!req.body) {
      return res.sendStatus(400);
    }

    const { username, password } = req.body;

    try {
      const usersCollection = db.collection("users");

      // Find user by username
      const user = await usersCollection.findOne({ username: username });

      if (!user) {
        return res.status(404).send({ ok: false, message: "User not found" });
      }

      // Compare provided password with stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        return res.status(401).send({ ok: false, message: "Invalid password" });
      }

      // Prepare user data for response (excluding sensitive information like passwordHash)
      const userData = {
        id: user._id.toString(),  // Convert ObjectId to string for frontend use
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        roles: user.roles,
        groupMemberships: user.groupMemberships,
        ok: true,
      };

      res.status(200).send(userData);
    } catch (err) {
      console.error("Error during user verification", err);
      res.status(500).send({ ok: false, message: "Internal Server Error" });

    }
  });
};
