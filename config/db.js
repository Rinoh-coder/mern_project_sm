// db.js
const mongoose = require("mongoose");
require('dotenv').config({path: './config/.env'});

mongoose
  .connect("mongodb+srv://" + process.env.DB_USER_PASS + "@clusterrinoh.i18jmnj.mongodb.net/mern-project")
  .then(() => console.log("Connected to mongoDB"))
  .catch((err) => console.log("failed to connect to mongoDB", err));