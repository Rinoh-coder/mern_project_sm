const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async(req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
};

module.exports.userInfo = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID unknown : ' + req.params.id);
    }
    try {
        const docs = await UserModel.findById(req.params.id).select('-password');
        if (!docs) {
            return res.status(404).send('User not found');
        }
        res.send(docs);
    } catch (err) {
        console.log('Erreur : ' + err);
        res.status(500).send('Internal server error');
    }
}