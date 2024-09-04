// delUserRoute.js
const fs = require("fs");
const USERDATA = "./data/users.json";
const AUTHDATA = "./data/auth.json";

module.exports = function (req, res) {
  const usernameToDelete = req.body.username;

  fs.readFile(USERDATA, "utf8", (err, userData) => {
    if (err) {
      return res.send({ ok: false, message: "Failed to read users data." });
    }

    let usersArray = JSON.parse(userData);
    const userIndex = usersArray.findIndex(
      (user) => user.username === usernameToDelete
    );

    if (userIndex === -1) {
      return res.send({ ok: false, message: "User not found in users.json." });
    }

    usersArray.splice(userIndex, 1);

    fs.writeFile(
      USERDATA,
      JSON.stringify(usersArray, null, 2),
      "utf8",
      (err) => {
        if (err) {
          return res.send({ ok: false, message: "Failed to save users data." });
        }

        fs.readFile(AUTHDATA, "utf8", (err, authData) => {
          if (err) {
            return res.send({
              ok: false,
              message: "Failed to read auth data.",
            });
          }

          let authArray = JSON.parse(authData);
          const authIndex = authArray.findIndex(
            (user) => user.username === usernameToDelete
          );

          if (authIndex === -1) {
            return res.send({
              ok: false,
              message: "User not found in auth.json.",
            });
          }

          authArray.splice(authIndex, 1);

          fs.writeFile(
            AUTHDATA,
            JSON.stringify(authArray, null, 2),
            "utf8",
            (err) => {
              if (err) {
                return res.send({
                  ok: false,
                  message: "Failed to save auth data.",
                });
              }
              res.send({ ok: true, message: "User deleted successfully." });
            }
          );
        });
      }
    );
  });
};
