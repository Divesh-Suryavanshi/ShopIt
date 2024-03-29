require("dotenv").config();
const User = require("../models/user");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { expressjwt } = require("express-jwt");

exports.signup = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      param: errors.array()[0].param,
    });
  }

  const user = new User(req.body);
  const result = await user.save();

  if (!result) {
    return res.status(400).json({
      err: "NOT able to save user in DB",
    });
  }

  res.json({
    name: user.name,
    email: user.email,
    id: user._id,
    success: true,
  });
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      param: errors.array()[0].param,
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      error: "USER does not exists",
    });
  }

  if (!user.authenticate(password)) {
    return res.status(401).json({
      error: "Email and password does not match",
    });
  }

  // Create token
  const token = jwt.sign({ _id: user._id }, process.env.SECRET);
  // put token in cookie
  res.cookie("token", token, { expire: new Date() + 9999 });

  // Send res to front-end
  const { _id, name, role } = user;
  return res.json({
    token,
    user: {
      _id,
      name,
      email,
      role,
    },
    success: true,
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signed out successfully",
  });
};

// protected routes
exports.isSignedIn = expressjwt({
  secret: process.env.SECRET, //Why secret is used here??????????????????
  algorithms: ["HS256"],
});

// custom middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not an admin, ACCESS DENIED",
    });
  }
  next();
};
