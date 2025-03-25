const express = require('express');
const { register, login,getuserdetails } = require('../controller/authController');
const { createPoll, getAllPolls, getUserPolls, deletePoll} = require('../controller/pollController');
const protect = require('../middleware/authmiddleware');
const upload = require('../middleware/uploadmiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/getuser', protect,getuserdetails );
// Create Poll API with image upload
router.post('/create-poll', protect, upload.array('images', 4), createPoll);
router.get('/getpolls', getAllPolls);
router.get('/userpoll', protect, getUserPolls);
router.delete('/delete-poll/:id', protect, deletePoll);

module.exports = router;