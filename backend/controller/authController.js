const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult, body } = require('express-validator');
const User = require('../models/user');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Register user with validation
const register = [
  body('username').trim().escape().isLength({ min: 3, max: 20 }),
  body('fullname').trim().escape().isLength({ min: 2, max: 50 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, fullname, email, password } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }

      const user = await User.create({ username, fullname, email, password });
      const token = generateToken(user._id);
      
      res.status(201).json({ 
        token,
        user: {
          _id: user._id,
          username: user.username,
          fullname: user.fullname,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Registration failed' });
    }
  }
];

// Login user with validation
const login = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user._id);
      res.status(200).json({ 
        token,
        user: {
          _id: user._id,
          username: user.username,
          fullname: user.fullname,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Login failed' });
    }
  }
];

const getuserdetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
};

module.exports = { register, login, getuserdetails };