// delGroupRoute.js
const fs = require('fs');
const GROUPS_PATH = './data/groupDB.json';

module.exports = function (req, res) {
  const groupId = req.body.id;

  // Read the current groups data
  fs.readFile(GROUPS_PATH, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading groups.json:', err);
      return res.status(500).send({ ok: false, message: 'Failed to read groups data.' });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (parseError) {
      console.error('Error parsing groups.json:', parseError);
      return res.status(500).send({ ok: false, message: 'Failed to parse groups data.' });
    }

    // Check if the parsed data has the expected structure
    if (!parsedData.groups || !Array.isArray(parsedData.groups)) {
      console.error('Invalid data format: Expected an array under "groups" key.');
      return res.status(500).send({ ok: false, message: 'Invalid data format in groups file.' });
    }

    // Access the groups array
    const groups = parsedData.groups;

    // Find the index of the group to be deleted
    const groupIndex = groups.findIndex(g => g.id === groupId);

    if (groupIndex === -1) {
      console.log('Group not found:', groupId);
      return res.send({ ok: false, message: 'Group not found.' });
    }

    // Remove the group from the array
    groups.splice(groupIndex, 1);

    // Write the updated groups data back to the file
    fs.writeFile(GROUPS_PATH, JSON.stringify(parsedData, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing to groups.json:', err);
        return res.status(500).send({ ok: false, message: 'Failed to save groups data.' });
      }

      console.log('Group deleted successfully.');
      res.send({ ok: true, message: 'Group deleted successfully.' });
    });
  });
};
