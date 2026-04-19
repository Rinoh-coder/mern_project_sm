// auth.controller.js

const jwt = require('jsonwebtoken');
require('dotenv').config({path: './config/.env'});
const UserModel = require('../models/user.model');

const maxAge = 3*24*60*60

// create token
 const createToken = (id) => {
  return jwt.sign({id}, process.env.TOKEN_SECRET, { expiresIn : maxAge})
  };


// signUp
module.exports.signUp = async (req, res) => {
  const { pseudo, email, password } = req.body;

  try {
    const user = await UserModel.create({ pseudo, email, password });
    res.status(201).json({ user: user._id });
  } catch (err) {
    console.error("Erreur détaillée :", err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "Pseudo ou email déjà utilisé" });
    }
    res.status(400).json({ error: err.message });
  }
};


// signIn
module.exports.signIn = async (req, res) => {
  const { email, password } = req.body
  try{
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly : true, maxAge : maxAge});
    res.status(200).json({user : user._id});
  } catch (err) {
    return res.status(400).json({ error : err.message})
  }
  };


// logout
module.exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 }); // Supprime le cookie
  res.status(200).json({ message: 'Logged out' });
};