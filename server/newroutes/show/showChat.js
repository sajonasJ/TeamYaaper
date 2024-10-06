// File: showChat.js

const { ObjectId } = require('mongodb'); // Import ObjectId to handle MongoDB IDs

module.exports = function (db, app) {
  // Endpoint to get all messages (chat) for a specific channel by its group and channel IDs
  app.get('/showChat/:groupId/:channelId', async (req, res) => {
    const groupId = req.params.groupId;
    const channelId = req.params.channelId;

    // Validate the provided IDs
    if (!ObjectId.isValid(groupId)) {
      return res.status(400).send({ message: 'Invalid Group ID.' });
    }

    try {
      // Connect to the "groups" collection in the database
      const groupsCollection = db.collection('groups');

      // Find the group with the given ID and then find the channel within it
      const group = await groupsCollection.findOne({ _id: new ObjectId(groupId) });

      // If the group does not exist, send a 404 response
      if (!group) {
        return res.status(404).send({ message: 'Group not found.' });
      }

      // Find the channel in the group by its ID
      const channel = group.channels.find(channel => channel._id === channelId);

      // If the channel is not found, send a 404 response
      if (!channel) {
        return res.status(404).send({ message: 'Channel not found.' });
      }

      // Return the list of messages in the channel
      res.status(200).send(channel.messages || []);

    } catch (error) {
      console.error('Error fetching chat messages:', error);
      res.status(500).send({ message: 'An error occurred while fetching chat messages.' });
    }
  });
};
