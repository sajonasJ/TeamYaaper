// server/newroutes/add/addSuperUser.js

module.exports = function (db, app) {
    app.put('/users/:username/makeSuper', async (req, res) => {
      const username = req.params.username;
  
      try {
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ username });
  
        if (!user) {
          return res.status(404).send({ message: 'User not found' });
        }
  
        if (!user.roles.includes('super')) {
          await usersCollection.updateOne(
            { username },
            { $addToSet: { roles: 'super' } }
          );
          res.status(200).send({ message: 'User upgraded to Super successfully' });
        } else {
          res.status(400).send({ message: 'User is already a superuser' });
        }
      } catch (err) {
        console.error('Error making user super:', err);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });
  };
  