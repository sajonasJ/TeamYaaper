// delUserRoute.js
const fs = require("fs");
const USERDATA = "./data/users.json";
const AUTHDATA = "./data/auth.json";

module.exports = function (req, res) {
  const usernameToDelete = req.body.username;

  // Read users.json to delete user from there
  fs.readFile(USERDATA, "utf8", (err, userData) => {
    if (err) {
      console.error("Error reading users.json:", err);
      return res
        .status(500)
        .send({ ok: false, message: "Failed to read users data." });
    }

    let usersArray = JSON.parse(userData);
    const userIndex = usersArray.findIndex(
      (user) => user.username === usernameToDelete
    );

    if (userIndex === -1) {
      return res
        .status(404)
        .send({ ok: false, message: "User not found in users.json." });
    }

    // Remove user from users.json array
    usersArray.splice(userIndex, 1);

    // Write the updated users.json file
    fs.writeFile(
      USERDATA,
      JSON.stringify(usersArray, null, 2),
      "utf8",
      (err) => {
        if (err) {
          console.error("Error writing to users.json:", err);
          return res
            .status(500)
            .send({ ok: false, message: "Failed to save users data." });
        }

        // Now read auth.json to delete user from there
        fs.readFile(AUTHDATA, "utf8", (err, authData) => {
          if (err) {
            console.error("Error reading auth.json:", err);
            return res
              .status(500)
              .send({ ok: false, message: "Failed to read auth data." });
          }

          let authArray = JSON.parse(authData);
          const authIndex = authArray.findIndex(
            (user) => user.username === usernameToDelete
          );

          if (authIndex === -1) {
            return res
              .status(404)
              .send({ ok: false, message: "User not found in auth.json." });
          }

          // Remove user from auth.json array
          authArray.splice(authIndex, 1);

          // Write the updated auth.json file
          fs.writeFile(
            AUTHDATA,
            JSON.stringify(authArray, null, 2),
            "utf8",
            (err) => {
              if (err) {
                console.error("Error writing to auth.json:", err);
                return res
                  .status(500)
                  .send({ ok: false, message: "Failed to save auth data." });
              }

              console.log("User deleted successfully.");
              res.send({ ok: true, message: "User deleted successfully." });
            }
          );
        });
      }
    );
  });
};
