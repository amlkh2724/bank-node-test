const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const userInfo = {
    username: user.username,
    email: user.email,
    cash:user.cash,
    credit:user.credit,
    id: user._id
  };
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: userInfo
    });
};
export default sendTokenResponse;
