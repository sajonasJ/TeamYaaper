const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);
const PORT = 3000;


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

//Routes Setup
app.post("/routes", require("./routes/routes"));
app.post("/postLogin", require("./routes/postLogin"));

// start the server
http.listen(PORT, () => {
  console.log("Server listening in " + PORT);
});