// upload.controller.js

const UserModel = require("../models/user.model");
const fs = require("fs");
const path = require("path");
const ObjectID = require("mongoose").Types.ObjectId;

//uploadProfil
module.exports.uploadProfil = async (req, res) => {
  try {
    if (!req.body.userId || !ObjectID.isValid(req.body.userId)) {
      throw new Error("Valid userId is required");
    }

    const user = await UserModel.findById(req.body.userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!req.file) {
      throw new Error("No file uploaded");
    }

    if (
      req.file.mimetype !== "image/jpg" &&
      req.file.mimetype !== "image/png" &&
      req.file.mimetype !== "image/jpeg"
    ) {
      throw new Error("Invalid file format");
    }

    if (req.file.size > 500000000) {
      throw new Error("File too large, max size 500Mb");
    }

    const fileName = user.pseudo + ".png";
    const uploadDir = `${__dirname}/../client/public/uploads/profil/`;

    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Écrire le fichier
    const filePath = path.join(uploadDir, fileName);

    // Si le fichier est dans req.file.buffer
    if (req.file.buffer) {
      fs.writeFileSync(filePath, req.file.buffer);
    }
    // Si le fichier a été sauvegardé temporairement
    else if (req.file.path) {
      fs.renameSync(req.file.path, filePath);
    } else {
      throw new Error("Unable to save file");
    }

    // Mettre à jour la base de données
    const pictureUrl = `./uploads/profil/${fileName}`;
    await UserModel.findByIdAndUpdate(user._id, { picture: pictureUrl });

    return res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      pseudo: user.pseudo,
      picture: pictureUrl,
    });
  } catch (err) {
    console.log("Erreur :", err);
    return res.status(400).json({ error: err.message });
  }
};
