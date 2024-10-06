// server/newroutes/show/getJoinRequests.js
module.exports = function (db, app) {
    app.get('/getJoinRequest/:groupId', async (req, res) => {
      const { groupId } = req.params;
  
      try {
        const joinRequestsCollection = db.collection('joinRequests');
        const requests = await joinRequestsCollection.find({ groupId, status: 'pending' }).toArray();
        res.status(200).send(requests);
      } catch (err) {
        console.error('Error retrieving join requests:', err);
        res.status(500).send({ ok: false, message: 'Internal Server Error' });
      }
    });
  };
  