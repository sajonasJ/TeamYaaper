// server/initializeDatabase.js

const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

// Replace this with your MongoDB URI
const uri = "mongodb://localhost:27017";
const dbName = "teamYaaper";

async function main() {
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected successfully to MongoDB");

    const db = client.db(dbName);

    // Initialize Collections

    // 1. Drop Users Collection if it exists
    const usersCollection = db.collection("users");
    const collections = await db.listCollections({ name: "users" }).toArray();
    if (collections.length > 0) {
      await usersCollection.drop();
      console.log("Dropped existing users collection");
    }

    // 2. Users Collection with Hashed Passwords
    const users = [
      {
        username: "user1",
        password: "1234", // Plain text password to be hashed
        firstname: "Jonas123",
        lastname: "Sajonas",
        email: "sajonasj@example.com",
        roles: ["super"],
        groupMemberships: [
          { groupId: "group1_id", role: "admin" },
          { groupId: "group2_id", role: "user" },
        ],
      },
      {
        username: "sajonasj",
        password: "1234",
        firstname: "Jonas2",
        lastname: "Sajonas2",
        email: "sajonasj@example.com",
        roles: ["super"],
        groupMemberships: [{ groupId: "group1_id", role: "admin" }],
      },
      {
        username: "user2",
        password: "1234",
        firstname: "",
        lastname: "",
        email: "",
        roles: [],
        groupMemberships: [],
      },
      {
        username: "user3",
        password: "1234",
        firstname: "",
        lastname: "",
        email: "",
        roles: [],
        groupMemberships: [],
      },
    ];

    // Hash the passwords before inserting them
    const saltRounds = 10;
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        return {
          ...user,
          passwordHash: hashedPassword,
          password: undefined, // Remove the plaintext password from the final object
        };
      })
    );

    // Insert hashed users into the collection
    await usersCollection.insertMany(hashedUsers);
    console.log("Users collection initialized with hashed passwords");

    // The rest of the collections...
    // 3. Groups Collection (you can add a similar drop statement if needed)
    const groupsCollection = db.collection("groups");
    await groupsCollection.insertMany([
      {
        name: "The Only Group One",
        description: "A group for general discussions and announcements.",
        ownerId: "user1_id", // Replace with the actual ObjectId if users have already been created
        admins: ["user1_id"],
        members: ["user1_id", "user2_id"],
        channels: [
          {
            channelId: "channel1_id",
            name: "General",
            description: "A channel for general discussions.",
          },
          {
            channelId: "channel2_id",
            name: "Announcements",
            description: "A channel for important announcements and updates.",
          },
        ],
      },
      {
        name: "wdwd",
        description: "asdad",
        ownerId: "user1_id",
        admins: ["user1_id"],
        members: [],
        channels: [],
      },
    ]);

    console.log("Groups collection initialized");

    // 4. Channels Collection
    const channelsCollection = db.collection("channels");
    await channelsCollection.insertMany([
      {
        groupId: "group1_id",
        name: "General",
        description: "A channel for general discussions.",
        users: ["user1_id", "user2_id", "user3_id"],
      },
      {
        groupId: "group1_id",
        name: "Announcements",
        description: "A channel for important announcements and updates.",
        users: ["user1_id", "user3_id"],
      },
    ]);

    console.log("Channels collection initialized");

    // 5. Messages Collection
    const messagesCollection = db.collection("messages");
    await messagesCollection.insertMany([
      {
        channelId: "channel1_id",
        userId: "user1_id",
        text: "Welcome to the General channel!",
        timestamp: new Date("2024-09-01T10:00:00Z"),
      },
      {
        channelId: "channel1_id",
        userId: "admin2_id",
        text: "Hello everyone, let's keep this channel for general discussions.",
        timestamp: new Date("2024-09-01T10:05:00Z"),
      },
    ]);

    console.log("Messages collection initialized");
  } catch (err) {
    console.error("Error connecting to MongoDB or inserting documents", err);
  } finally {
    await client.close();
  }

  // 6. Join Requests Collection
  const joinRequestsCollection = db.collection("joinRequests");
  await joinRequestsCollection.insertMany([
    {
      groupId: "group1_id",
      userId: "user3_id",
      status: "pending",
      requestDate: new Date(),
    },
    {
      groupId: "group2_id",
      userId: "user2_id",
      status: "approved",
      requestDate: new Date(),
    },
  ]);

  console.log("Join requests collection initialized");
}

main().catch(console.error);
