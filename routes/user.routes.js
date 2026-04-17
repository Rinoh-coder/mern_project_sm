// user.routes.js

const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');


//auth
router.post("/register", authController.signUp);


//user database
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);

module.exports = router ;