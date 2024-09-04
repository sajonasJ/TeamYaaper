// loginRoute.js
var fs = require("fs");
const PATH = "./data/users.json";

module.exports = function (req, res) {
  let userobj = {
    id: req.body.id,
    username: req.body.username,
    firstname: req.body.firstname || "",
    lastname: req.body.lastname || "",
    email: req.body.email || "",
    groups: req.body.groups || {},
    roles: req.body.roles || [],
  };

  // Read the current users data
  fs.readFile(PATH, "utf8", function (err, data) {
    if (err) {
      return res.send({ ok: false, message: "Failed to read users data." });
    }

    let uArray = JSON.parse(data);

    if (!req.body.id) {
      return res.send(uArray);
    }

    // Find the user by username
    let i = uArray.findIndex((x) => x.username === userobj.username);

    if (i === -1) {
      uArray.push(userobj);
    } else {
      uArray[i] = userobj;
    }

    let uArrayjson = JSON.stringify(uArray, null, 2);

    // Write the updated users data back to the file
    fs.writeFile(PATH, uArrayjson, "utf8", function (err) {
      if (err) {
        return res.send({ ok: false, message: "Failed to save user data." });
      }

      res.send({ ok: true, message: "User data saved successfully." });
    });
  });
};
