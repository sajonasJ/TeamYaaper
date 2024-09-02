var fs = require("fs");
const PATH = "./data/users.json";

module.exports = function (req, res) {
  let userobj = {
    id: req.body.id,
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    groups:req.body.groups,
    roles:req.body.roles
  };
  let uArray = [];

  fs.readFile(PATH, "utf8", function (err, data) {
    if (err) throw err;
    uArray = JSON.parse(data);
    console.log(userobj);

    let i = uArray.findIndex((x) => x.username == userobj.username);

    // if index is not found push userobj, if found the index is the userobj
    if (i === -1) {
      uArray.push(userobj);
    } else {
      uArray[i] = userobj;
    }

    // res.send(uArray);
    let uArrayjson = JSON.stringify(uArray, null, 2);
    fs.writeFile(PATH, uArrayjson, "utf8", function (err) {
      if (err) throw err;
    });
    res.send(uArray);
  });
};
