// server/newroutes/add/addJoinRequest.js
module.exports = function (db, app) {
    app.post('/addJoinRequest', async (req, res) => {
      const { groupId, userId } = req.body;
  
      if (!groupId || !userId) {
        return res.status(400).send({ ok: false, message: 'Invalid request data' });
      }
  
      try {
        const joinRequestsCollection = db.collection('joinRequests');
  
        // Check if there's already a pending request
        const existingRequest = await joinRequestsCollection.findOne({
          groupId,
          userId,
          status: 'pending',
        });
  
        if (existingRequest) {
          return res.status(400).send({ ok: false, message: 'Request already pending' });
        }
  
        // Insert a new join request
        await joinRequestsCollection.insertOne({
          groupId,
          userId,
          status: 'pending',
          requestedAt: new Date(),
        });
  
        res.status(200).send({ ok: true, message: 'Join request submitted successfully' });
      } catch (err) {
        console.error('Error creating join request:', err);
        res.status(500).send({ ok: false, message: 'Internal Server Error' });
      }
    });
  };
  