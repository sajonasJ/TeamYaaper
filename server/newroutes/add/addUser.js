// server/newroutes/add/addUser.js - To add a new user
const bcrypt = require("bcrypt");

module.exports = function (db, app) {
  app.post("/addUser", async (req, res) => {
    if (!req.body) {
      return res.sendStatus(400);
    }

    const { username, password } = req.body;

    try {
      const usersCollection = db.collection("users");

      // Check if user already exists
      const userExists = await usersCollection.findOne({ username: username });
      if (userExists) {
        return res
          .status(409)
          .send({ ok: false, message: "User already exists" });
      }

      // Hash the password
      const passwordHash = await bcrypt.hash(password, 10);

      // Insert new user
      const newUser = {
        username: username,
        passwordHash: passwordHash,
        roles: [],
        groupMemberships: [],
      };

      await usersCollection.insertOne(newUser);
      res.status(201).send({ ok: true, message: "User added successfully" });
    } catch (err) {
      res.status(500).send({ ok: false, message: "Internal Server Error" });
    }
  });
};
