// File: showChannels.js

const { ObjectId } = require('mongodb'); // Import ObjectId to handle MongoDB IDs

module.exports = function (db, app) {
  app.get('/showChannels/:groupId', async (req, res) => {
    const groupId = req.params.groupId;

    if (!ObjectId.isValid(groupId)) {
      return res.status(400).send({ message: 'Invalid Group ID.' });
    }

    try {
      const groupsCollection = db.collection('groups');

      const group = await groupsCollection.findOne({ _id: new ObjectId(groupId) });

      if (!group) {
        return res.status(404).send({ message: 'Group not found.' });
      }

      res.status(200).send(group.channels || []);

    } catch (error) {
      console.error('Error fetching channels:', error);
      res.status(500).send({ message: 'An error occurred while fetching channels.' });
    }
  });
};
