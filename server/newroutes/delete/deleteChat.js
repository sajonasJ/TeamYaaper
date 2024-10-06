// File: deleteChat.js

const { ObjectId } = require('mongodb'); // Import ObjectId to handle MongoDB IDs

module.exports = function (db, app) {
  // Endpoint to delete a specific chat message from a channel
  app.delete('/deleteChat', async (req, res) => {
    if (!req.body || !req.body.groupId || !req.body.channelId || !req.body.messageId) {
      return res.status(400).send({ message: 'Invalid request. Group ID, Channel ID, and Message ID are required.' });
    }

    const { groupId, channelId, messageId } = req.body;

    try {
      // Connect to the "groups" collection in the database
      const groupsCollection = db.collection('groups');

      // Find the group and remove the specified message from the appropriate channel
      const result = await groupsCollection.updateOne(
        { _id: new ObjectId(groupId), "channels.id": channelId }, // Match the specific group and channel
        { $pull: { "channels.$.messages": { id: messageId } } } // Remove the message from the messages array within the channel
      );

      // Check if the update was successful
      if (result.modifiedCount === 1) {
        res.status(200).send({ message: 'Chat message deleted successfully' });
      } else {
        res.status(404).send({ message: 'Group, Channel, or Message not found. Unable to delete.' });
      }

    } catch (error) {
      console.error('Error deleting chat message:', error);
      res.status(500).send({ message: 'An error occurred while deleting the chat message' });
    }
  });
};
