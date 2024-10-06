// File: deleteChannel.js

const { ObjectId } = require('mongodb'); // Import ObjectId to handle MongoDB IDs

module.exports = function (db, app) {
  // Endpoint to delete a specific channel from a group
  app.delete('/deleteChannel', async (req, res) => {
    if (!req.body || !req.body.groupId || !req.body.channelId) {
      return res.status(400).send({ message: 'Invalid request. Group ID and Channel ID are required.' });
    }

    const { groupId, channelId } = req.body;

    try {
      // Connect to the "groups" collection in the database
      const groupsCollection = db.collection('groups');

      // Find the group and remove the specified channel from its channels array
      const result = await groupsCollection.updateOne(
        { _id: new ObjectId(groupId) }, // Match the specific group by its ID
        { $pull: { channels: { id: channelId } } } // Remove the channel from the channels array
      );

      // Check if the update was successful
      if (result.modifiedCount === 1) {
        res.status(200).send({ message: 'Channel deleted successfully' });
      } else {
        res.status(404).send({ message: 'Group or Channel not found. Unable to delete.' });
      }

    } catch (error) {
      console.error('Error deleting channel:', error);
      res.status(500).send({ message: 'An error occurred while deleting the channel' });
    }
  });
};
