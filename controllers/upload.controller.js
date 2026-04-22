const UserModel = require("../models/user.model");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

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

    if (req.file.size > 500000) {
      throw new Error("File too large, max size 500kb");
    }

    // Nom du fichier = pseudo + .png
    const fileName = user.pseudo + ".png";

    // Chemin du dossier d'upload
    const uploadDir = `${__dirname}/../client/public/uploads/profil/`;

    // Vérifier/créer le dossier s'il n'existe pas
    const fs = require("fs");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Upload du fichier
    await pipeline(
      req.file.stream,
      fs.createWriteStream(`${uploadDir}${fileName}`)
    );

    // Mettre à jour le chemin dans la base de données
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
