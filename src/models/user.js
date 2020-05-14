const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task = require("../models/task");

// have to create user schema first then pass into model in ordre to use middlewares
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalidate.");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('Password cannot contain "password".');
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number!");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// mongoose virtual field, not stored in db
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

// userSchema.methods to add custom methods on the user instance
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "thisismysecret");
  // save the generated token into user
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// use this method to hide password and tokens in res.send
// toJSON is called when we are trying to stringify an object
userSchema.methods.toJSON = function () {
  const user = this;

  // Transform user intance into a raw object to manipulate
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

// userSchema.statics to add custom methods on the User model
userSchema.statics.findByCredencials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login.");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

/************************** User Middlewares **************************/

// use middlewares befor saving
// need to using binding so cannot use arrow function
userSchema.pre("save", async function (next) {
  // this is user tobe saved
  const user = this;
  // hash password
  // check if password is being modified, prevent rehashing already hashed password
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next(); // let mongooes know middleware is done, continue to save
});

// delete all user tasks before that user is removed
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
