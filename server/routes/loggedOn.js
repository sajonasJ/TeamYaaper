var fs = require("fs");

module.exports = function (req, res) {
  let userobj = {
    userid: req.body.userid,
    username: req.body.username,
    userbirthdate: req.body.userbirthdate,
    userage: req.body.userage,
  };
  let uArray = [];

  fs.readFile("./data/loggedOn.json", "utf8", function (err, data) {
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
    fs.writeFile("./data/loggedOn.json", uArrayjson, "utf8", function (err) {
      if (err) throw err;
    });
  });
};
