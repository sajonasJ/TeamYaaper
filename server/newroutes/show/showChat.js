// C:\Users\jonas\Code\prog_repos\TeamYaaper\server\newroutes\show\showChat.js
const { ObjectId } = require('mongodb');  // Import ObjectId from the mongodb library


module.exports = function (db, app) {
 // Route to get messages for a specific channel by its groupId and channelName
app.get('/showChat/:groupId/:channelName', async (req, res) => {
  const groupId = req.params.groupId;
  const channelName = req.params.channelName;

  try {
    const groupsCollection = db.collection('groups');
    const group = await groupsCollection.findOne({ _id: new ObjectId(groupId) });

    if (!group) {
      return res.status(404).send({ message: 'Group not found.' });
    }

    // Find the channel by name
    const channel = group.channels.find((channel) => channel.name === channelName);

    if (!channel) {
      return res.status(404).send({ message: 'Channel not found.' });
    }

    // Return the messages array from the found channel
    res.status(200).send(channel.messages || []);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).send({ message: 'An error occurred while fetching chat messages.' });
  }
});
}