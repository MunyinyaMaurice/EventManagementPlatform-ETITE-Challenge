const mongoose = require('mongoose');

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error("Please provide a valid email address");
  }

  // Validate password strength (at least 6 characters, 1 uppercase, 1 number, 1 symbol)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400);
    throw new Error(
      "Password must be at least 6 characters long and contain at least one uppercase letter, one number, and one special character (!@#$%^&*)"
    );
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409);
    throw new Error("User already registered!, try to use different email");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  if (user) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
          roles:user.roles,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "40m" }
    );
    res.status(200).json({ accessToken });
    // res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});


//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  //compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
          roles:user.roles,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "40m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
});

//@desc Current user info
//@route POST /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});


//@desc Get all users info
//@route GET /api/users
//@access private (accessible to ADMIN only)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, 'username email roles');
  const userDetails = users.map(user => ({
    username: user.username,
    email: user.email,
    roles: user.roles
  }));
  res.json(userDetails);
});

//@desc Update user info
//@route GET /api/users
// @access private update user information (accessible to authenticated users)
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;
  const loggedInUserId = req.user._id;

  try {
    // Check if userId is a valid ObjectId
    if (!mongoose.isValidObjectId(userId)) {
      res.status(400);
      throw new Error('Invalid user ID');
    }

    // Retrieve the user from the database
    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Check authorization
    if (!(req.user.roles.includes('ADMIN')) && !user._id.equals(loggedInUserId)) {
      res.status(403);
      throw new Error('You are not authorized to perform this action');
    }

    // Update user's information
    user.set(updatedUser); // Apply updates to the retrieved user object
    const updatedUserData = await user.save(); // Save the updated user data

    res.json(updatedUserData); // Respond with the updated user data
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' });
  }
});



module.exports = { registerUser, loginUser, currentUser,getAllUsers, updateUser  };
