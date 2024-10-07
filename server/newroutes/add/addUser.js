// server/newroutes/add/addUser.js - To add a new user
const bcrypt = require("bcrypt");

module.exports = function (db, app) {
  app.post("/addUser", async (req, res) => {
    console.log("Received POST request to add user");
    
    // Check if request body is present
    if (!req.body) {
      console.error("No request body provided");
      return res.sendStatus(400);
    }

    const { username, password, firstname, lastname, email } = req.body;
    console.log("Request data:", { username, password, firstname, lastname, email });

    try {
      const usersCollection = db.collection("users");

      // Check if user already exists
      console.log("Checking if user already exists...");
      const userExists = await usersCollection.findOne({ username: username });
      if (userExists) {
        console.warn("User already exists:", username);
        return res
          .status(409)
          .send({ ok: false, message: "User already exists" });
      }

      // Hash the password
      console.log("Hashing the password...");
      const passwordHash = await bcrypt.hash(password, 10);
      console.log("Password hashed successfully");

      // Prepare the new user object with optional fields
      const newUser = {
        username: username,
        passwordHash: passwordHash,
        roles: [], // Initially no roles assigned
        groupMemberships: [], // Initially no groups assigned
        ...(firstname && { firstname }), // Adds 'firstname' if provided
        ...(lastname && { lastname }), // Adds 'lastname' if provided
        ...(email && { email }), // Adds 'email' if provided
      };
      console.log("New user object prepared:", newUser);

      // Insert the new user into the database
      console.log("Inserting new user into the database...");
      const result = await usersCollection.insertOne(newUser);
      console.log("User inserted successfully:", result.insertedId);

      res.status(201).send({ ok: true, message: "User added successfully" });
    } catch (err) {
      console.error("Error adding user:", err);
      res.status(500).send({ ok: false, message: "Internal Server Error" });
    }
  });
};
