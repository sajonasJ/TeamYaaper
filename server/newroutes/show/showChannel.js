// File: showChannels.js

const { ObjectId } = require('mongodb'); // Import ObjectId to handle MongoDB IDs

module.exports = function (db, app) {
  // Endpoint to get all channels for a specific group by its ID
  app.get('/showChannels/:groupId', async (req, res) => {
    const groupId = req.params.groupId;

    // Validate the provided group ID
    if (!ObjectId.isValid(groupId)) {
      return res.status(400).send({ message: 'Invalid Group ID.' });
    }

    try {
      // Connect to the "groups" collection in the database
      const groupsCollection = db.collection('groups');

      // Find the group with the given ID
      const group = await groupsCollection.findOne({ _id: new ObjectId(groupId) });

      // If the group does not exist, send a 404 response
      if (!group) {
        return res.status(404).send({ message: 'Group not found.' });
      }

      // Return the channels of the group
      res.status(200).send(group.channels || []);

    } catch (error) {
      console.error('Error fetching channels:', error);
      res.status(500).send({ message: 'An error occurred while fetching channels.' });
    }
  });
};
