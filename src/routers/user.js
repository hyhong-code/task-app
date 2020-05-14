const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");

// defines a new router, router.get instead of app.get
const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    const savedUser = await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ savedUser, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    // custom method added on User model
    const user = await User.findByCredencials(req.body.email, req.body.password);
    // custom method added on user instances
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});

// middleware for specific route, pass in as 2nd argument
router.get("/users/me", auth, async (req, res) => {
  // Only going to run if auth middleware verifes thr token and found a user
  // sends back user's profile
  res.send(req.user);
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
    // cannot use findByIdAndUpdate because we want to use bcrypt hashing as middleware
    const user = await User.findById(req.params.id);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

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
