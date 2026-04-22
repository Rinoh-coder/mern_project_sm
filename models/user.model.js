const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 60,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      maxLength: 1024,
      minLength: 6,
    },
    picture: {
      type: String,
      default: "./uploads/profil/random-user.png",
    },
    bio: {
      type: String,
      maxLength: 1024,
    },
    followers: {
      type: [String],
    },
    following: {
      type: [String],
    },
    likes: {
      type: [String],
    },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt automatiquement
  },
);

/**
Ce bloc est un **middleware Mongoose** qui s'exécute **automatiquement avant chaque sauvegarde** d'un utilisateur : il **hash le mot de passe avec bcrypt** uniquement si ce champ a été modifié (création ou mise à jour), garantissant qu'il n'est jamais stocké en clair dans la base de données.
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

/**
Ce bloc de code ajoute une méthode statique login au schéma utilisateur pour trouver un utilisateur par son email et vérifier son mot de passe hashé, retournant l'utilisateur si les identifiants sont corrects ou lançant une erreur sinon.
 */
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
