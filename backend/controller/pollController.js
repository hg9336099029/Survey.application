const express = require('express');
const Poll = require('../models/poll');
const User = require('../models/user');

// Create poll
const createPoll = async (req, res) => {
    try {
        const { question, pollType, options } = req.body;

        // Validate required fields
        if (!question || !pollType) {
            return res.status(400).json({ message: 'Question and Poll Type are required' });
        }

        // Process images
        const images = req.files ? req.files.map(file => {
            if (file.size > 2 * 1024 * 1024) {
                throw new Error('One or more files exceed 2MB size limit');
            }
            return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        }) : [];

        // Parse options safely
        const parsedOptions = options ? JSON.parse(options) : [];

        const newPoll = new Poll({
            question,
            pollType,
            options: parsedOptions.map(option => ({ text: option, votes: 0 })),
            images,
            createdBy: req.user._id // Associate poll with the user
        });

        await newPoll.save();
        res.status(201).json({ message: 'Poll created successfully', poll: newPoll });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all polls
const getAllPolls = async (req, res) => {
    try {
        const polls = await Poll.find()
            .populate('createdBy', 'username fullname')
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json({ polls });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get polls of a specific user
const getUserPolls = async (req, res) => {
    try {
        const polls = await Poll.find({ createdBy: req.user._id })
            .populate('createdBy', 'username fullname')
            .sort({ createdAt: -1 });
        res.status(200).json({ polls });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete poll of a specific user
const deletePoll = async (req, res) => {
    try {
        const poll = await Poll.findByIdAndDelete(req.params.id);
        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }
        res.status(200).json({ message: "Poll deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Vote on a poll
const voteOnPoll = async (req, res) => {
    try {
        const { pollId } = req.params; // Get pollId from URL params
        const { optionIndex, comment } = req.body; // Get optionIndex or comment from request body

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }

        // Check if the user has already commented
        if (poll.pollType === "open ended" && comment) {
            if (poll.voters.includes(req.user._id)) {
                return res.status(400).json({ message: "You have already commented on this poll" });
            }

            poll.comments.push({ user: req.user._id, text: comment });
            poll.voters.push(req.user._id); // Add the user to the list of voters
            // add poll id to user's votedPolls
            const user = await User.findById(req.user._id);
            user.votedPolls.push(poll._id);
            await user.save();
            await poll.save();

            return res.status(200).json({ message: "Comment submitted successfully", poll });
        }

        // Handle other poll types (e.g., yes/no, rating, etc.)
        if (optionIndex !== undefined) {
            if (poll.voters.includes(req.user._id)) {
                return res.status(400).json({ message: "You have already voted on this poll" });
            }

            poll.options[optionIndex].votes += 1;
            poll.voters.push(req.user._id); // Add the user to the list of voters
            // add poll id to user's votedPolls
            const user = await User.findById(req.user._id);
            user.votedPolls.push(poll._id);
            await user.save();
            await poll.save();

            return res.status(200).json({ message: "Vote recorded successfully", poll });
        }

        res.status(400).json({ message: "Invalid request" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// show voted polls by particular user

const getVotedPolls = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('votedPolls');
        res.status(200).json({ votedPolls: user.votedPolls });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//show bookmarked polls by particular user

const getbookmarkedPolls = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('bookmarkedPolls');
        res.status(200).json({ bookmarkedPolls: user.bookmarkedPolls });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//bookmark the poll


module.exports = { createPoll, getAllPolls, getUserPolls, deletePoll, voteOnPoll, getVotedPolls, getbookmarkedPolls };