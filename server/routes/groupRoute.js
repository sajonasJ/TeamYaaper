const fs = require("fs");
const PATH = "./data/groupDB.json";

module.exports = function (req, res) {
  let groupObj = {
    groupId: req.body.groupId,
    name: req.body.name,
    superuser: req.body.superuser,
    admins: req.body.admins,
    users: req.body.users,
    channels: req.body.channels,
  };

  fs.readFile(PATH, "utf8", (err, data) => {
    if (err) throw err;

    const groupDB = JSON.parse(data);
    let groups = groupDB.groups || [];

    let index = groups.findIndex(group => group.groupId === groupObj.groupId);

   index === -1? groups.push(groupObj):groups[index] = groupObj;
   res.send(groups);

     // Convert the updated groups array back to JSON format
    let groupJSON = JSON.stringify({ groups: groups }, null, 2);

    // Write the updated groups back to the file
    fs.writeFile(PATH, groupJSON, "utf8", function (err) {
      if (err) throw err;
    });
  });
};
