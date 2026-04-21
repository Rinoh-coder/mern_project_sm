// post.controller.js

const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;


module.exports.readPost = async (req, res) => {
    try {
        const posts = await PostModel.find()
        if (posts.length === 0) {
            return res.status(404).send("No post to read !");
        } return res.status(200).send(posts);
    } catch (err) {
        console.log("Erreur : " + err);
        return res.status(500).send('Internal Server error');
    }
};

module.exports.createPost = (req, res) => {
    
}

module.exports.updatePost = (req, res) => {
    
}

module.exports.deletePost = (req, res) => {
    
}