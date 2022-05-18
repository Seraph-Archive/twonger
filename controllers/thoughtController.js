const { Thought, User } = require('../models');

const thoughtController = {
    getThoughts(req, res) {
        Thought.find({}).populate({
            path: 'reactions',
            select: '-__v',
        }).select('-__v').sort({
            _id: -1
        }).then((thoughtData) => res.json(thoughtData))
        .catch((err) => {
            console.err(err)
            res.sendStatus(400);
        });
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id }).populate({
            path: 'reactions',
            select: '-__v',
        }).select('-__v').then((thoughtData) => {
            if(!thoughtData) {
                return res.status(404).json({ message: 'No thought with this ID' });
            }
            res.json(thoughtData);
        })
        .catch((err) => {
            console.err(err)
            res.sendStatus(400);
        });
    },

    createThought({ body }, res) {
        Thought.create(body).then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: _id } },
                { new: true }
            );
        }).then((userData) => {
            if(!userData) {
                return res.status(404).json({ message: 'No user with that ID' })
            }
            res.json({ message: 'Thought created' });
        })
        .catch((err) => {
            console.log(err)
            res.sendStatus(400);
        });
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id }).then((thoughtData) => {
            if(!thoughtData) {
                return res.status(404).json({ message: 'No thought with this ID' });
            }

            return User.findOneAndUpdate(
                { thoughts: params.id },
                { $pull : { thoughts: params.id } },
                { new: true }
            );
        }).then((userData) => {
            if(!userData) {
                return res.status(404).json({ message: 'No user with this ID' });
            }
            res.json({ message: 'Thought deleted' });
        })
        .catch((err) => {
            console.err(err)
            res.sendStatus(400);
        });
    },

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            {new: true, 
            runValidators: true}
        ).then((thoughtData) => {
            if(!thoughtData) {
                return res.status(404).json({ message: 'No thought with this ID' });
            }
            res.json(thoughtData);
        })
        .catch((err) => {
            console.err(err)
            res.sendStatus(400);
        });
    },

    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            {new: true }
        ).then((thoughtData) => {
            res.json(thoughtData)
        })
        .catch((err) => {
            console.err(err)
            res.sendStatus(400);
        });
    }
};

module.exports = thoughtController;