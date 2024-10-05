// Import MongoClient from the mongodb package
const { MongoClient } = require('mongodb');

// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// Database Name
const dbName = "teamYaaper";

// Main function that connects to the database
async function main() {
  await client.connect();
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  return db;
}

// Function to close the MongoDB connection
async function closeConnection() {
  await client.close();
  console.log("MongoDB connection closed.");
}

module.exports = { main, closeConnection };
