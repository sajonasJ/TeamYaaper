//C:\Users\jonas\Code\prog_repos\TeamYaaper\server\newroutes\add\addChat.js

const { ObjectId } = require('mongodb'); // Import ObjectId to handle MongoDB IDs

module.exports = function (db, app) {
  // POST endpoint to add a new chat message to the "messages" collection
  app.post('/addChat', async (req, res) => {
    const { channelId, senderId, name, text, timestamp } = req.body;

    // Validate the data
    if (!ObjectId.isValid(channelId)) {
      return res.status(400).send({ message: 'Invalid Channel ID.' });
    }
    if (!senderId || !name || !text || !timestamp) {
      return res.status(400).send({ message: 'Missing required message data.' });
    }

    try {
      // Create the message document to insert
      const message = {
        channelId: new ObjectId(channelId),  // Store channelId as ObjectId
        senderId,
        name,
        text,
        timestamp: new Date(timestamp),
      };

      // Insert the message into the "messages" collection
      const messagesCollection = db.collection('messages');
      const result = await messagesCollection.insertOne(message);

      // Respond with success if insertion was successful
      res.status(201).send({ message: 'Message saved successfully.', messageId: result.insertedId });
    } catch (error) {
      console.error('Error saving chat message:', error);
      res.status(500).send({ message: 'Failed to save chat message.' });
    }
  });
};