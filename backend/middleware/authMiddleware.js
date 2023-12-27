const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  try {
    console.log("Protect middleware reached");
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, please login");
    }

    // Decode the token to get the user's role
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Determine the secret based on the user's role
    const secret =
      decodedToken.role === "admin"
        ? process.env.ADMIN_JWT_SECRET
        : process.env.USER_JWT_SECRET;

    // Verify the token with the determined secret
    const verifiedToken = jwt.verify(token, secret);

    const user = await User.findById(verifiedToken.id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized, please login");
  }
});

const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(400);
    throw new Error("Not authorized as admin");
  }
});

module.exports = {
  protect,
  adminOnly,
};
