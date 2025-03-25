const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    pollType: {
        type: String,
        required: true,
    },
    options: [
        {
            text: { type: String, required: true },
            votes: { type: Number, default: 0 }
        }
    ],
    images: [
        {
            type: String,
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    voters: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            unique: true, // Ensure a user votes only once
        }
    ]
}, { timestamps: true });

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
