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
module.exports.deletePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  }

  try {
    const deletePost = await PostModel.findOneAndDelete({ _id: req.params.id });
    if (!deletePost) {
      return res.status(404).send("Post not found");
    }
    return res.status(200).send("Successfully deleted");
  } catch (err) {
    console.log(" Erreur : " + err);
    return res.status(500).json({ message: err });
  }
};

//likePost
module.exports.likePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID post unknown : " + req.params.id);
  }
  if (!ObjectID.isValid(req.body.idLiker)) {
    return res.status(400).send("ID's liker invalid");
  }

  try {
    const userExist = await UserModel.findById(req.body.idLiker);
    if (!userExist) {
      return res.status(404).send("User liker not found");
    }
    const postLikers = await PostModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likers: req.body.idLiker } },
      { new: true },
    );

    if (!postLikers) {
      return res.status(400).send("Failed to be liked");
    }

    const likesUser = await UserModel.findByIdAndUpdate(
      req.body.idLiker,
      { $addToSet: { likes: req.params.id } },
      { new: true },
    );
    if (!likesUser) {
      return res.status(400).send("Failed to like");
    }

    return res.json({
      success: true,
      message: "Successfully liked",
      post: postLikers,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//unlikePost
module.exports.unlikePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID post unknown : " + req.params.id);
  }
  if (!ObjectID.isValid(req.body.idUnliker)) {
    return res.status(400).send("ID's unliker invalid");
  }

  try {
    const userExist = await UserModel.findById(req.body.idUnliker);
    if (!userExist) {
      return res.status(404).send("User unliker not found");
    }
    const postLikers = await PostModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { likers: req.body.idUnliker } },
      { new: true },
    );

    if (!postLikers) {
      return res.status(400).send("Failed to be unliked");
    }

    const likesUser = await UserModel.findByIdAndUpdate(
      req.body.idUnliker,
      { $pull: { likes: req.params.id } },
      { new: true },
    );
    if (!likesUser) {
      return res.status(400).send("Failed to unlike");
    }

    return res.json({
      success: true,
      message: "Successfully unliked",
      post: postLikers,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//commentPost
module.exports.commentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID post unknown : " + req.params.id);
  }
  if (!req.body.commenterId || !ObjectID.isValid(req.body.commenterId)) {
    return res.status(400).send("Comment Id not valid");
  }
  if (!req.body.text || req.body.text.trim() === "") {
    return res.status(400).send("Text required")
  }

  
  try {
    const user = await UserModel.findById(req.body.commenterId);
    if (!user) {
        return res.status(404).send("User commenter not found");
    }
    const newComment = await PostModel.findByIdAndUpdate(
        req.params.id,
        {
            $push : {
                comments : {
                    commenterId : req.body.commenterId,
                    commenterPseudo : user.pseudo,
                    text : req.body.text.trim(),
                    timestamp : Date.now()
                }
            }
        },
        { new : true}
    );
    if (!newComment) {
        return res.status(400).send("failed to comment the post");
    }
    return res.status(201).send("Succefully commented");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }    
};
