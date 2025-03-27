const express = require('express');
const { register, login, getuserdetails } = require('../controller/authController');
const { createPoll, getAllPolls, getUserPolls, deletePoll, voteOnPoll,getVotedPolls } = require('../controller/pollController');
const protect = require('../middleware/authmiddleware');
const upload = require('../middleware/uploadmiddleware');
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/getuser', protect, getuserdetails);

// Create Poll API with image upload
router.post('/create-poll', protect, upload.array('images', 4), createPoll);

// Get all polls
router.get('/getpolls', getAllPolls);

// Get polls created by the logged-in user
router.get('/userpoll', protect, getUserPolls);

// Delete a poll
router.delete('/delete-poll/:id', protect, deletePoll);

// Vote on a poll
router.patch('/votepoll/:pollId', protect, voteOnPoll);

// get voted polls
router.get('/getvotedpolls',protect,getVotedPolls);

module.exports = router;