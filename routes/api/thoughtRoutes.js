const router = require('express').Router();
const { getThoughts, getThoughtById, createThought, deleteThought, addReaction, deleteReaction } = require('../../controllers/thoughtController');

router.route('/').get(getThoughts).post(createThought);

router.route('/:id').get(getThoughtById).delete(deleteThought);

router.route('/:thoughtId/reactions').post(addReaction);

router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);

module.exports = router;