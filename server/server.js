// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);
const PORT = 3000;
const AUTHROUT= require("./routes/authRoute")
const LOGINROUT = require("./routes/loginRoute")
const GROUPROUT=require("./routes/groupRoute")
const SAVEROUT=require("./routes/saveUserRoute")
const DELGROUPROUT=require("./routes/delGroupRoute")
const DELUSERROUT=require("./routes/delUserRoute")


//CORS Middleware Configuration
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: "GET,POST",
  })
);

//Express Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//log check for errors
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});


//Routes Setup
app.post("/authRoute", AUTHROUT);
app.post("/loginRoute", LOGINROUT);
app.post("/groupRoute", GROUPROUT);
app.post("/saveUserRoute",SAVEROUT);
app.post("/delGroupRoute", DELGROUPROUT);
app.post("/delUserRoute",DELUSERROUT);

// start the server
http.listen(PORT, () => {
  console.log("Server listening in " + PORT);
});
