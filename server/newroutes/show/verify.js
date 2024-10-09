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

      const user = await usersCollection.findOne({ username: username });

      if (!user) {
        return res.status(404).send({ ok: false, message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        return res.status(401).send({ ok: false, message: "Invalid password" });
      }


      const userData = {
        id: user._id.toString(),
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        roles: user.roles,
        groupMemberships: user.groupMemberships,
        profilePictureUrl: user.profilePictureUrl
          ? `http://localhost:3000${user.profilePictureUrl}`
          : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp",
        ok: true,
      };

      res.status(200).send(userData);
    } catch (err) {
      console.error("Error during user verification", err);
      res.status(500).send({ ok: false, message: "Internal Server Error" });
    }
  });
};
