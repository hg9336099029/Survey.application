const express = require('express');
const Poll = require('../models/poll');
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

const getAllPolls = async (req, res) => {
    try {
        const polls = await Poll.find().populate('createdBy', 'username').sort({ createdAt: -1 }).lean();
        res.status(200).json({ polls });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get polls of a specific user
const getUserPolls = async (req, res) => {
    try {
        const polls = await Poll.find({ createdBy: req.user._id }).populate('createdBy', 'username').sort({ createdAt: -1 });
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

module.exports = {createPoll, getAllPolls, getUserPolls, deletePoll };