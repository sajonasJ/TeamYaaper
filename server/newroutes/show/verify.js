// server/verify.js

const bcrypt = require("bcrypt");

module.exports = function (db, app) {
  app.post("/auth/verify", async (req, res) => {
    if (!req.body) {
      return res.sendStatus(400);
    }

    const { username, password } = req.body;

    try {
      const usersCollection = db.collection("users");

      // Find user by username
      const user = await usersCollection.findOne({ username: username });

      if (!user) {
        return res.send({ ok: false, message: "User not found" });
      }

      // Compare provided password with stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        return res.send({ ok: false, message: "Invalid password" });
      }

      // Prepare user data for response (excluding sensitive information like passwordHash)
      const userData = {
        id: user._id,  // Include user ID in the response
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        roles: user.roles,
        groupMemberships: user.groupMemberships,
        ok: true,
      };

      res.send(userData);
    } catch (err) {
      console.error("Error during user verification", err);
      res.sendStatus(500);
    }
  });
};
