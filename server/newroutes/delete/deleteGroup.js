// File: deleteGroup.js

const { ObjectId } = require('mongodb'); // Import ObjectId to handle MongoDB IDs

module.exports = function (db, app) {
  // Endpoint to delete a specific group by its ID
  app.delete('/deleteGroup/:groupId', async (req, res) => {
    const groupId = req.params.groupId;

    if (!ObjectId.isValid(groupId)) {
      return res.status(400).send({ message: 'Invalid Group ID.' });
    }

    try {
      // Connect to the "groups" collection in the database
      const groupsCollection = db.collection('groups');

      // Delete the group with the specified ID
      const result = await groupsCollection.deleteOne({ _id: new ObjectId(groupId) });

      // Check if the group was deleted successfully
      if (result.deletedCount === 1) {
        res.status(200).send({ message: 'Group deleted successfully' });
      } else {
        res.status(404).send({ message: 'Group not found. Unable to delete.' });
      }

    } catch (error) {
      console.error('Error deleting group:', error);
      res.status(500).send({ message: 'An error occurred while deleting the group' });
    }
  });
};
