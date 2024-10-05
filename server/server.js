// server.js
const express = require("express"); 
const cors = require("cors"); 
const app = express(); 
// const http = require("http").Server(app); //! change
// const PORT = 3000; //! change
// const AUTHROUT= require("./routes/authRoute") //! change
// const LOGINROUT = require("./routes/loginRoute") //! change
// const GROUPROUT=require("./routes/groupRoute") //! change
// const SAVEROUT=require("./routes/saveUserRoute") //! change
// const DELGROUPROUT=require("./routes/delGroupRoute") //! change
// const DELUSERROUT=require("./routes/delUserRoute") //! change

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CORS Middleware Configuration
app.use(cors());

let db;

//log check for errors
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});


// //! To change Routes Setup
// app.post("/authRoute", AUTHROUT); //!
// app.post("/loginRoute", LOGINROUT); //!
// app.post("/groupRoute", GROUPROUT); //!
// app.post("/saveUserRoute",SAVEROUT); //!
// app.post("/delGroupRoute", DELGROUPROUT); //!
// app.post("/delUserRoute",DELUSERROUT); //!

// load routes
require("./newroutes/")(db,app);

async function startServer() {
  db = await main();

  // Start the server
  app.listen(3000, () => {
    console.log("Server running on port 3000...");
  });
}

// Gracefully handle shutdown
process.on('SIGINT', async () => {
  console.log("Shutting down server...");
  if (db) {
    await closeConnection();
    console.log("MongoDB connection closed.");
  }
  process.exit(0);
});

startServer();
