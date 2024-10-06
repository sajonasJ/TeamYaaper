// server/newroutes/add/addUserGroup.js

module.exports = function (db, app) {
    app.put('/groups/:id/user', async (req, res) => {
      const groupId = req.params.id;
      const { username } = req.body;
  
      try {
        const groupsCollection = db.collection('groups');
        const group = await groupsCollection.findOne({ _id: new ObjectId(groupId) });
  
        if (!group) {
          return res.status(404).send({ message: 'Group not found' });
        }
  
        // Add user to group if not already present
        if (!group.users.includes(username)) {
          await groupsCollection.updateOne(
            { _id: new ObjectId(groupId) },
            { $push: { users: username } }
          );
          res.status(200).send({ message: 'User added successfully to the group' });
        } else {
          res.status(400).send({ message: 'User already exists in group' });
        }
      } catch (err) {
        console.error('Error adding user to group:', err);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });
  };
  