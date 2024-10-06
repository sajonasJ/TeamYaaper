const { ObjectId } = require('mongodb');

module.exports = function (db, app) {
  app.put('/updateChannel/:groupId/:channelId', async (req, res) => {
    const groupId = req.params.groupId;
    const channelId = req.params.channelId;
    const updatedChannel = req.body;

    if (!ObjectId.isValid(groupId) || !ObjectId.isValid(channelId)) {
      return res.status(400).send({ message: 'Invalid Group or Channel ID.' });
    }

    try {
      const groupsCollection = db.collection('groups');

      const updateFields = {};
      if (updatedChannel.name) updateFields["channels.$.name"] = updatedChannel.name;
      if (updatedChannel.description) updateFields["channels.$.description"] = updatedChannel.description;

      const result = await groupsCollection.updateOne(
        {
          _id: new ObjectId(groupId),
          "channels._id": new ObjectId(channelId),
        },
        {
          $set: updateFields,
        }
      );

      if (result.modifiedCount === 1) {
        res.status(200).send({ message: 'Channel updated successfully' });
      } else {
        res.status(404).send({ message: 'Group or Channel not found. Unable to update.' });
      }

    } catch (error) {
      console.error('Error updating channel:', error);
      res.status(500).send({ message: 'An error occurred while updating the channel.' });
    }
  });
};
