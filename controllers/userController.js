const { User } = require('../models');

const userController = {
    getUsers(req, res) {
        User.find().populate({
            path: 'friends',
            select: '-__v'
        }).select('-__v').sort({ _id: -1 }).then((userData) => {
            res.json(userData)
        })
        .catch((err) => {
            console.err(err)
            res.sendStatus(400);
        });
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.id }).populate({
            path: 'thoughts',
            select: '-__v'
        }).populate({
            path: 'friends',
            select: '-__v'
        }).then((userData) => {
            if(!userData){
                return res.status(404).json({ message: 'No user with that ID'})
            }
            res.json(userData)
        })
        .catch((err) => {
            console.err(err)
            res.sendStatus(400);
        });
    },

    createUser({ body }, res) {
        User.create(body).then((userData) => {
            res.json(userData)
        })
        .catch((err) => {
            console.err(err)
            res.sendStatus(400);
        });
    },
    
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, {
            new: true,
            runValidator: true
        }).then((userData) => {
            if(!userData) {
               return res.status(404).json({ message: 'No user with that ID' })
            }
            res.json(userData)
        })
        .catch((err) => {
            console.err(err)
            res.sendStatus(400);
        });
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id }).then((userData) => {
            if(!userData) {
                return res.status(404).json({ message: 'No user with that ID' })
            }
            res.json(userData)
        })
        .catch((err) => {
            console.err(err)
            res.sendStatus(400);
        });
    },
    
}

module.exports = userController;