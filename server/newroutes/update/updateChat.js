// File: updateChat.js

const { ObjectId } = require('mongodb'); // Import ObjectId to handle MongoDB IDs

module.exports = function (db, app) {
  // Endpoint to update a specific chat message in a group by group ID, channel ID, and message ID
  app.put('/updateChat/:groupId/:channelId/:messageId', async (req, res) => {
    const groupId = req.params.groupId;
    const channelId = req.params.channelId;
    const messageId = req.params.messageId;
    const updatedMessageData = req.body;

    // Validate the provided IDs
    if (!ObjectId.isValid(groupId) || !ObjectId.isValid(channelId) || !ObjectId.isValid(messageId)) {
      return res.status(400).send({ message: 'Invalid Group, Channel, or Message ID.' });
    }

    try {
      // Connect to the "groups" collection in the database
      const groupsCollection = db.collection('groups');

      // Prepare the fields that need to be updated
      const updateFields = {};
      if (updatedMessageData.text) {
        updateFields["channels.$[channel].messages.$[message].text"] = updatedMessageData.text;
      }
      if (updatedMessageData.timestamp) {
        updateFields["channels.$[channel].messages.$[message].timestamp"] = updatedMessageData.timestamp;
      }

      // Perform the update operation using arrayFilters to identify the correct channel and message
      const result = await groupsCollection.updateOne(
        {
          _id: new ObjectId(groupId),
          "channels._id": new ObjectId(channelId),
          "channels.messages._id": new ObjectId(messageId),
        },
        {
          $set: updateFields,
        },
        {
          arrayFilters: [
            { "channel._id": new ObjectId(channelId) },
            { "message._id": new ObjectId(messageId) }
          ],
        }
      );

      // Check if the update was successful
      if (result.modifiedCount === 1) {
        res.status(200).send({ message: 'Message updated successfully' });
      } else {
        res.status(404).send({ message: 'Group, Channel, or Message not found. Unable to update.' });
      }

    } catch (error) {
      console.error('Error updating message:', error);
      res.status(500).send({ message: 'An error occurred while updating the message.' });
    }
  });
};
