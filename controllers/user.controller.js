// user.controller.js

const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;


// getAllUsers
module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

module.exports.userInfo = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  }
  try {
    const docs = await UserModel.findById(req.params.id).select("-password");
    if (!docs) {
      return res.status(404).send("User not found");
    }
    res.send(docs);
  } catch (err) {
    console.log("Erreur : " + err);
    res.status(500).send("Internal server error");
  }
};


// updateUser
module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  }

  try {
    const updateUser = await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    if (!updateUser) {
      return res.status(500).send("Fail update");
    }
    return res.send(updateUser);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};


// deleteUser
module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  }

  try {
    await UserModel.findOneAndDelete({ _id: req.params.id }).exec();
    return res.status(200).send("Successfully deleted");
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};


// follow
module.exports.follow = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  }
  if (!ObjectID.isValid(req.body.idToFollow)) {
    return res.status(400).send("ID to target follow invalid");
  }
  if (req.params.id === req.body.idToFollow) {
    return res.status(400).send(" You can't follow yourself");
  }

  try {
    // add to following list the targetUser
    const currentUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true },
    );

    if (!currentUser) {
      return res.status(400).send("Failed to follow");
    }

    //add to the targetUser follower's list the currentUser
    const targetUser = await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true },
    );
    if (!targetUser) {
      return res.status(400).send("Failed to follow");
    }

    return res.json({
      success: true,
      message: "Successfully followed",
      currentUser: currentUser,
      targetUser: targetUser,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



// unfollow
module.exports.unfollow = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  }
  if (!ObjectID.isValid(req.body.idToUnfollow)) {
    return res.status(400).send("ID to target unfollow invalid");
  }

  // we have already make impossible to follow ourself so these codes are not useful

  //if (req.params.id === req.body.idToUnfollow) {
  //  return res.status(400).send(" You can't unfollow yourself");
  //}

  try {
    // add to following list the targetUser
    const currentUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true },
    );

    if (!currentUser) {
      return res.status(400).send("Failed to unfollow");
    }

    //add to the targetUser follower's list the currentUser
    const targetUser = await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: req.params.id } },
      { new: true },
    );
    if (!targetUser) {
      return res.status(400).send("Failed to unfollow");
    }

    return res.json({
      success: true,
      message: "Successfully unfollowed",
      currentUser: currentUser,
      targetUser: targetUser,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
