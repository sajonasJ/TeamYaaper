// loginRoute.js
var fs = require("fs");
const PATH = "./data/users.json";

module.exports = function (req, res) {
  let userobj = {
    id: req.body.id,
    username: req.body.username,
    firstname: req.body.firstname || '',
    lastname: req.body.lastname || '',
    email: req.body.email || '',
    groups: req.body.groups || {},
    roles: req.body.roles || [],
  };

  // Read the current users data
  fs.readFile(PATH, "utf8", function (err, data) {
    if (err) {
      console.error("Error reading users.json:", err);
      return res.status(500).send({ ok: false, message: "Failed to read users data." });
    }

    let uArray = JSON.parse(data);

    if (!req.body.id) {
      console.log("No ID provided, returning all users.");
      return res.send(uArray);
    }

    // Find the user by username
    let i = uArray.findIndex((x) => x.username === userobj.username);

    if (i === -1) {
      // User not found, add as new user
      console.log("Adding new user:", userobj.username);
      uArray.push(userobj);
    } else {
      // User found, update existing user data
      console.log("Updating user:", userobj.username);
      uArray[i] = userobj;
    }

    let uArrayjson = JSON.stringify(uArray, null, 2);

    // Write the updated users data back to the file
    fs.writeFile(PATH, uArrayjson, "utf8", function (err) {
      if (err) {
        console.error("Error writing to users.json:", err);
        return res.status(500).send({ ok: false, message: "Failed to save user data." });
      }

      console.log("User data saved successfully.");
      res.send({ ok: true, message: "User data saved successfully." });
    });
  });
};
