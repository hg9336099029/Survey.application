const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profileImageUrl: {
        type: String,
        default: ''
    },
    votedPolls: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll'
    }],
    bookmarkedPolls: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll'
    }]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword, next) {
    const match = await bcrypt.compare(candidatePassword, this.password);
    return match;
};

module.exports = mongoose.model('User', userSchema);