// saveUserRoute.js
const fs = require("fs");
const USERS = "./data/auth.json";

module.exports = function (req, res) {
  var u = req.body.username;
  var p = req.body.password;

  if (req.body.newUser) {
    fs.readFile(USERS, "utf8", function (err, data) {
      if (err) {
        return res.send({ ok: false, message: "Internal server error." });
      }

      let userArray;
      try {
        userArray = JSON.parse(data);
      } catch (parseError) {
        return res.send({ ok: false, message: "Internal server error." });
      }

      if (userArray.some((user) => user.username === u)) {
        return res.send({ ok: false, message: "Username already exists." });
      }

      userArray.push({ username: u, password: p });
      fs.writeFile(
        USERS,
        JSON.stringify(userArray, null, 2),
        "utf8",
        function (err) {
          if (err) {
            return res.send({ ok: false, message: "Internal server error." });
          }
          res.send({ ok: true, message: "User added successfully." });
        }
      );
    });
    return;
  }
};
