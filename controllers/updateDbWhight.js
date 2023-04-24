import asyncHandler from "../middleware/errorHandler.js";
import User from "../models/authRoutes.js";
import sendTokenResponse from "../utils/sendTokenResponse.js";
export const getaAllUsers = asyncHandler(async (req, res, next) => {
  const findAllUsers = await User.find();
  res.status(200).json({
    success: true,
    data: findAllUsers,
  });
});

export const getSpecificUser = asyncHandler(async (req, res) => {
  const specificUser = await User.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: specificUser,
  });
});

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const checkRegister = asyncHandler(async (req, res, next) => {
  const { username, email, password, cash, credit } = req.body;

  const user = await User.create({
    username,
    email,
    password,
    cash,
    credit,
  });

  // Send token to client
  sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    // Important to return the same error message so no one can know the reason for login failure
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Send token to client
  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   POST /api/v1/auth/current-user
// @access  Private
export const getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    withdraw money from User
// @route   PUT /api/v1/users/withdraw/:id/:cash
export const depositeUser = asyncHandler(async (req, res, next) => {
  const specificUser = await User.findById(req.params.id);

  specificUser.cash = Number(specificUser.cash) + Number(req.params.cash);
  const user = await User.findByIdAndUpdate(req.params.id, specificUser, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(
      new Error(`User that end with '${req.params.id.slice(-6)}' not found`)
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

