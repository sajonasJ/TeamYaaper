// server/newroutes/update/updateJoinRequest.js
module.exports = function (db, app) {
    app.post('/updateJoinRequest', async (req, res) => {
      const { requestId, status } = req.body;
  
      if (!requestId || !['approved', 'rejected'].includes(status)) {
        return res.status(400).send({ ok: false, message: 'Invalid request data' });
      }
  
      try {
        const joinRequestsCollection = db.collection('joinRequests');
        await joinRequestsCollection.updateOne(
          { _id: new db.ObjectID(requestId) },
          { $set: { status } }
        );
  
        if (status === 'approved') {
          // Find the updated request to add the user to the group
          const updatedRequest = await joinRequestsCollection.findOne({ _id: new db.ObjectID(requestId) });
          const groupCollection = db.collection('groups');
  
          // Add the user to the group if approved
          await groupCollection.updateOne(
            { _id: new db.ObjectID(updatedRequest.groupId) },
            { $addToSet: { users: updatedRequest.userId } }
          );
        }
  
        res.status(200).send({ ok: true, message: `Join request ${status} successfully` });
      } catch (err) {
        console.error('Error updating join request:', err);
        res.status(500).send({ ok: false, message: 'Internal Server Error' });
      }
    });
  };
  