// auth.controller.js

const UserModel = require('../models/user.model');


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