// server/newroutes/delete/deleteAdminGroup.js

module.exports = function (db, app) {
    app.delete('/groups/:id/admin', async (req, res) => {
      const groupId = req.params.id;
      const { username } = req.body;
  
      try {
        const groupsCollection = db.collection('groups');
        const userExists = await groupsCollection.findOne({ _id: new ObjectId(groupId) });
  
        if (!userExists) {
          return res.status(404).send({ message: 'Group not found' });
        }
  
        // Remove the admin from the group
        await groupsCollection.updateOne(
          { _id: new ObjectId(groupId) },
          { $pull: { admins: username } }
        );
        res.status(200).send({ message: 'Admin removed successfully' });
      } catch (err) {
        console.error('Error deleting admin from group:', err);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });
  };
  