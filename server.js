//server.js

const express = require("express");
require('./config/db');
require("dotenv").config({ path: "./config/.env" });

const {checkUser, requireAuth} = require('./middleware/auth.middleware');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const userRoutes = require('./routes/user.routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());


// jwt
app.use(checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id)
});


//routes
app.use('/api/user', userRoutes);


// server
app.listen(process.env.PORT, () => {
  console.log(`listen on port ${process.env.PORT}`);
});
