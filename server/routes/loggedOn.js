var fs = require("fs");

module.exports = function (req, res) {
  let userobj = {
    id: req.body.id,
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    groups:req.body.groups
  };
  let uArray = [];

  fs.readFile("./data/users.json", "utf8", function (err, data) {
    if (err) throw err;
    uArray = JSON.parse(data);
    console.log(userobj);

    let i = uArray.findIndex((x) => x.username == userobj.username);
    if (i == -1) {
      uArray.push(userobj);
    } else {
      uArray[i] = userobj;
    }
    res.send(uArray);
    let uArrayjson = JSON.stringify(uArray);
    fs.writeFile("./data/users.json", uArrayjson, "utf8", function (err) {
      if (err) throw err;
    });
  });
};
