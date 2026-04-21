// post.controller.js

const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

// readPost
module.exports.readPost = async (req, res) => {
  try {
    const posts = await PostModel.find();
    if (posts.length === 0) {
      return res.status(404).send("No post to read !");
    }
    return res.status(200).send(posts);
  } catch (err) {
    console.log("Erreur : " + err);
    return res.status(500).send("Internal Server error");
  }
};

// createPost
module.exports.createPost = async (req, res) => {
  if (!req.body.posterId) {
    return res.status(400).send("User Id required");
  }

  if (!ObjectID.isValid(req.body.posterId)) {
    return res.status(400).send("ID unknown : " + req.body.posterId);
  }

  const userExist = await UserModel.findById(req.body.posterId);
  if (!userExist) {
    return res.status(404).send(" User not found");
  }

  if (!req.body.message) {
    return res.status(400).send("Message est requis");
  }

  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    video: req.body.video || "",
    likers: [],
    comments: [],
  });
  try {
    const post = await newPost.save();
    return res.status(201).send(post);
  } catch (err) {
    console.log("Erreur : " + err);
    return res.status(400).send(err);
  }
};

//updatePost
module.exports.updatePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  }
  if (!req.body.message) {
    return res.status(400).send("Message requis pour la modification");
  }
  const updateRecord = { message: req.body.message };
  try {
    const postUpdated = await PostModel.findByIdAndUpdate(
      req.params.id,
      { $set: updateRecord },
      { new: true },
    );
    if (!postUpdated) {
      return res.status(404).send("Post not found");
    }
    return res.status(200).send(postUpdated);
  } catch (err) {
    console.log("Erreur : " + err);
    return res.status(400).send(err);
  }
};

// deletePost
module.exports.deletePost = (req, res) => {};
