// server/server.js
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

    // Load routes and pass the database object to them
    require("./newroutes/show/verify")(db, app);

    // Start listening on port 3000
    app.listen(3000, () => {
      console.log("Server running on port 3000...");
    });

  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

// Gracefully handle shutdown
process.on('SIGINT', async () => {
  console.log("Shutting down server...");
  if (db) {
    await closeConnection();
    console.log("MongoDB connection closed.");
  }
  process.exit(0);
});

startServer();
