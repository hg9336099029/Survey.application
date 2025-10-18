const express = require('express');
const { register, login, logout, getuserdetails, updateProfile, changePassword } = require('../controller/authController');
const { createPoll, getAllPolls, getUserPolls, deletePoll, voteOnPoll, getVotedPolls, bookmarkpoll, getbookmarkedPolls } = require('../controller/pollController');
const protect = require('../middleware/authmiddleware');
const upload = require('../middleware/uploadmiddleware');
const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);

// User routes
router.get('/getuser', protect, getuserdetails);
router.put('/update-profile', protect, upload.single('profileImage'), updateProfile);
router.put('/change-password', protect, changePassword);

// Poll creation and retrieval
router.post('/create-poll', protect, upload.array('images', 4), createPoll);
router.get('/getpolls', getAllPolls);
router.get('/userpoll', protect, getUserPolls);

// Poll deletion
router.delete('/delete-poll/:id', protect, deletePoll);

// Voting and polls
router.patch('/votepoll/:pollId', protect, voteOnPoll);
router.get('/getvotedpolls', protect, getVotedPolls);

// Bookmarking
router.post('/bookmarkpoll/:pollId', protect, bookmarkpoll);
router.get('/getbookmarkedpolls', protect, getbookmarkedPolls);

module.exports = router;