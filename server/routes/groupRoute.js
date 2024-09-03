// groupRoute.js
const fs = require("fs");
const PATH = "./data/groupDB.json";

module.exports = function (req, res) {
  console.log("Incoming Request Body:", req.body);
  fs.readFile(PATH, "utf8", (err, data) => {
    if (err) throw err;

    const groupDB = JSON.parse(data);
    let groups = groupDB.groups || [];

    if (!req.body.id) {
      console.log("No ID provided, returning all groups.");
      return res.send(groups);
    }

    let groupObj = {
      id: req.body.id,
      name: req.body.name,
      description: req.body.description || "",
      admins: req.body.admins || [],
      users: req.body.users || [],
      channels: req.body.channels || [],
    };

    let index = groups.findIndex((group) => group.id === groupObj.id);
    index === -1 ? groups.push(groupObj) : (groups[index] = groupObj);

    let groupJSON = JSON.stringify({ groups: groups }, null, 2);

    fs.writeFile(PATH, groupJSON, "utf8", function (err) {
      if (err) throw err;
    });
    res.send(groups);
  });
};
