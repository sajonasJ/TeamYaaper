// saveUserRoute.js
const fs = require('fs');
const USERS = './data/auth.json';

module.exports = function (req, res) {
  var u = req.body.username;
  var p = req.body.password;

  if (req.body.newUser) {
    fs.readFile(USERS, 'utf8', function (err, data) {
      if (err) {
        console.error('Error reading auth.json:', err);
        return res.status(500).send({ ok: false, message: 'Internal server error.' });
      }

      let userArray;
      try {
        userArray = JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing auth.json:', parseError);
        return res.status(500).send({ ok: false, message: 'Internal server error.' });
      }

      // Check if the username already exists
      if (userArray.some(user => user.username === u)) {
        return res.send({ ok: false, message: 'Username already exists.' });
      }

      // Add new user
      userArray.push({ username: u, password: p });
      fs.writeFile(USERS, JSON.stringify(userArray, null, 2), 'utf8', function (err) {
        if (err) {
          console.error('Error writing to auth.json:', err);
          return res.status(500).send({ ok: false, message: 'Internal server error.' });
        }
        res.send({ ok: true, message: 'User added successfully.' });
      });
    });
    return;
  }
}
