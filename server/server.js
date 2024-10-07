// C:\Users\jonas\Code\prog_repos\TeamYaaper\server\server.js = absolute path
const express = require("express");
const cors = require("cors");
const { main, closeConnection } = require("../app"); // Import the main function from app.js
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Middleware Configuration
app.use(cors());

let db;

// Log check for incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

// Start the server
async function startServer() {
  try {
    db = await main(); // Connect to MongoDB and assign the database object to `db`
    console.log("Connected successfully to MongoDB from server.js");

    //Add Routes
    // require("./newroutes/add/addAdminGroup")(db, app);
    require("./newroutes/add/addChannel")(db, app);
    require("./newroutes/add/addChat")(db, app);
    require("./newroutes/add/addGroup")(db, app);
    require("./newroutes/add/addJoinRequest")(db, app);
    require("./newroutes/add/addSuperUser")(db, app);
    require("./newroutes/add/addUser")(db, app);
    // require("./newroutes/add/addUserGroup")(db, app);

    //Delete Routes
    // require("./newroutes/delete/deleteAdminGroup")(db, app);
    require("./newroutes/delete/deleteChannel")(db, app);
    require("./newroutes/delete/deleteChat")(db, app);
    require("./newroutes/delete/deleteGroup")(db, app);
    require("./newroutes/delete/deleteSuper")(db, app);
    require("./newroutes/delete/deleteUser")(db, app);

    //Show Routes
    require("./newroutes/show/showAllGroups")(db, app);
    require("./newroutes/show/showAllUsers")(db, app);
    require("./newroutes/show/showChannel")(db, app);
    require("./newroutes/show/showChat")(db, app);
    require("./newroutes/show/showGroup")(db, app);
    require("./newroutes/show/showJoinRequest")(db, app);
    require("./newroutes/show/showUser")(db, app);
    require("./newroutes/show/verify")(db, app);

    //Update Routes
    require("./newroutes/update/updateChannel")(db, app);
    require("./newroutes/update/updateChat")(db, app);
    require("./newroutes/update/updateGroup")(db, app);
    require("./newroutes/update/updateJoinRequest")(db, app);
    require("./newroutes/update/updateUser")(db, app);

    
    // Start listening on port 3000
    app.listen(3000, () => {
      console.log("Server running on port 3000...");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

// Gracefully handle shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  if (db) {
    await closeConnection();
    console.log("MongoDB connection closed.");
  }
  process.exit(0);
});

startServer();
