const express = require("express");
const User = require("../models/user");

// defines a new router, router.get instead of app.get
const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    const savedUser = await user.save();
    res.status(201).send(savedUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/users", async (req, res) => {
  try {
    // pass in no query params to find method to get all users in User model
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    // findOne or findById both works
    const user = await User.findById(_id);
    // if mongodb can't find anything, it is still considered a success, NOT errors
    if (!user) {
      return res.status(404).send();
    }
    res.send(user); // default status code 200
  } catch (error) {
    res.status(500).send(error);
  }
});

// properties patched that does not exist on User will be ignored
router.patch("/users/:id", async (req, res) => {
  // make sure user only updates props that already exist
  const updates = Object.keys(req.body); // returns an array of keys
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Operations" });
  }
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ _id: req.params.id });
    if (!deletedUser) {
      return res.status(404).send();
    }
    res.send(deletedUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

// export the router
module.exports = router;
