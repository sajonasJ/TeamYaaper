const { ObjectId } = require('mongodb'); // Import ObjectId to handle MongoDB IDs

module.exports = function (db, app) {
  // Endpoint to update a specific user's information by user ID
  app.put('/updateUser/:userId', async (req, res) => {
    const userId = req.params.userId;
    const updatedUserData = req.body;

    console.log('Received PUT request to update user');
    console.log('User ID:', userId);
    console.log('Updated User Data:', updatedUserData);

    // Validate the provided user ID
    if (!ObjectId.isValid(userId)) {
      console.error('Invalid User ID:', userId);
      return res.status(400).send({ message: 'Invalid User ID.' });
    }

    try {
      // Connect to the "users" collection in the database
      console.log('Connecting to the "users" collection');
      const usersCollection = db.collection('users');

      // Prepare the fields that need to be updated
      const updateFields = {};
      if (updatedUserData.username) {
        updateFields.username = updatedUserData.username;
      }
      if (updatedUserData.email) {
        updateFields.email = updatedUserData.email;
      }
      if (updatedUserData.firstname) {
        updateFields.firstname = updatedUserData.firstname;
      }
      if (updatedUserData.lastname) {
        updateFields.lastname = updatedUserData.lastname;
      }
      if (updatedUserData.roles) {
        updateFields.roles = updatedUserData.roles; // Array of roles
      }
      if (updatedUserData.groups) {
        updateFields.groups = updatedUserData.groups; // Array of group IDs or names
      }

      console.log('Fields to be updated:', updateFields);

      // Perform the update operation
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateFields }
      );

      // Log the result of the update operation
      console.log('Update result:', result);

      // Check if the update was successful
      if (result.modifiedCount === 1) {
        console.log('User updated successfully for ID:', userId);
        res.status(200).send({ ok: true, message: 'User updated successfully' });
      } else {
        console.warn('User not found or no changes made for ID:', userId);
        res.status(404).send({ ok: false, message: 'User not found. Unable to update.' });
      }

    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send({ message: 'An error occurred while updating the user.' });
    }
  });
};
