module.exports = function (db, app) {
    // Fetch the Current User based on session or token
    app.get("/allUsers", async (req, res) => {
      try {
        const username = req.query.username; // Assuming the username is passed as a query param
        if (!username) {
          return res.status(400).send({ message: "Username is required" });
        }
  
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({ username });
  
        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }
  
        res.status(200).send(user);
      } catch (err) {
        console.error("Error fetching current user:", err);
        res.status(500).send({ message: "An error occurred while fetching the current user" });
      }
    });
  };
  
