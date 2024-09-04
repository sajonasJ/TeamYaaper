// delGroupRoute.js
const fs = require("fs");
const GROUPS_PATH = "./data/groupDB.json";

module.exports = function (req, res) {
  const groupId = req.body.id;

  fs.readFile(GROUPS_PATH, "utf8", (err, data) => {
    if (err) {
      return res.send({ ok: false, message: "Failed to read groups data." });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (parseError) {
      return res.send({ ok: false, message: "Failed to parse groups data." });
    }

    const groups = parsedData.groups;
    const groupIndex = groups.findIndex((g) => g.id === groupId);

    if (groupIndex === -1) {
      return res.send({ ok: false, message: "Group not found." });
    }

    groups.splice(groupIndex, 1);

    fs.writeFile(
      GROUPS_PATH,
      JSON.stringify(parsedData, null, 2),
      "utf8",
      (err) => {
        if (err) {
          return res.send({
            ok: false,
            message: "Failed to save groups data.",
          });
        }
        res.send({ ok: true, message: "Group deleted successfully." });
      }
    );
  });
};
