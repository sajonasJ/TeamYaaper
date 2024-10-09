// server/initializeDatabase.js

const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

const uri = "mongodb://localhost:27017";
const dbName = "teamYaaper";

async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");

    const db = client.db(dbName);

    // Drop collections if they exist to prevent duplication
    const collectionNames = ["users", "groups", "channels", "messages", "joinRequests"];
    for (const collectionName of collectionNames) {
      const collection = db.collection(collectionName);
      const exists = await db.listCollections({ name: collectionName }).toArray();
      if (exists.length > 0) {
        await collection.drop();
        console.log(`Dropped existing ${collectionName} collection`);
      }
    }

    const users = [
      {
        _id: new ObjectId(),
        username: "user1",
        password: "1234",
        firstname: "Jonas123",
        lastname: "Sajonas",
        email: "sajonasj@example.com",
        roles: ["super"],
        groupMemberships: [],
      },
      {
        _id: new ObjectId(),
        username: "sajonasj",
        password: "1234",
        firstname: "Jonas2",
        lastname: "Sajonas2",
        email: "sajonasj@example.com",
        roles: ["super"],
        groupMemberships: [],
      },
      {
        _id: new ObjectId(),
        username: "user2",
        password: "1234",
        firstname: "",
        lastname: "",
        email: "",
        roles: [],
        groupMemberships: [],
      },
      {
        _id: new ObjectId(),
        username: "user3",
        password: "1234",
        firstname: "",
        lastname: "",
        email: "",
        roles: [],
        groupMemberships: [],
      },
    ];

    const saltRounds = 10;
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        return {
          ...user,
          passwordHash: hashedPassword,
          password: undefined,
        };
      })
    );

    await db.collection("users").insertMany(hashedUsers);
    console.log("Users collection initialized with hashed passwords");

    const user1Id = users[0]._id;
    const user2Id = users[2]._id;
    const user3Id = users[3]._id;

    const groups = [
      {
        _id: new ObjectId(),
        name: "The Only Group One",
        description: "A group for general discussions and announcements.",
        ownerId: user1Id,
        admins: [user1Id],
        members: [user1Id, user2Id],
        channels: [
          {
            channelId: new ObjectId(),
            name: "General",
            description: "A channel for general discussions.",
          },
          {
            channelId: new ObjectId(),
            name: "Announcements",
            description: "A channel for important announcements and updates.",
          },
        ],
      },
      {
        _id: new ObjectId(),
        name: "wdwd",
        description: "asdad",
        ownerId: user1Id,
        admins: [user1Id],
        members: [],
        channels: [],
      },
    ];

    await db.collection("groups").insertMany(groups);
    console.log("Groups collection initialized");

    const group1Id = groups[0]._id;

    await db.collection("users").updateOne(
      { _id: user1Id },
      { $set: { groupMemberships: [group1Id] } }
    );

    await db.collection("users").updateOne(
      { _id: user2Id },
      { $set: { groupMemberships: [group1Id] } }
    );

    console.log("Updated user group memberships");

    await db.collection("channels").insertMany([
      {
        groupId: group1Id,
        name: "General",
        description: "A channel for general discussions.",
        users: [user1Id, user2Id, user3Id],
      },
      {
        groupId: group1Id,
        name: "Announcements",
        description: "A channel for important announcements and updates.",
        users: [user1Id, user3Id],
      },
    ]);

    console.log("Channels collection initialized");

    await db.collection("messages").insertMany([
      {
        channelId: groups[0].channels[0].channelId,
        userId: user1Id,
        text: "Welcome to the General channel!",
        timestamp: new Date("2024-09-01T10:00:00Z"),
      },
      {
        channelId: groups[0].channels[0].channelId,
        userId: user2Id,
        text: "Hello everyone, let's keep this channel for general discussions.",
        timestamp: new Date("2024-09-01T10:05:00Z"),
      },
    ]);

    console.log("Messages collection initialized");

    await db.collection("joinRequests").insertMany([
      {
        groupId: group1Id,
        userId: user3Id,
        status: "pending",
        requestDate: new Date(),
      },
      {
        groupId: groups[1]._id,
        userId: user2Id,
        status: "approved",
        requestDate: new Date(),
      },
    ]);

    console.log("Join requests collection initialized");

  } catch (err) {
    console.error("Error connecting to MongoDB or inserting documents", err);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
