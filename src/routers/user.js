const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const sharp = require("sharp");
const { sendWelcomeEmail, sendGoodByeEmail } = require("../emails/account");

const multer = require("multer");
const upload = multer({
  limits: {
    // fileSize is in bytes
    fileSize: 1000000,
  },
  // file filter function
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error("Please upload an image!"));
    }
    callback(undefined, true);
    // callback(new Error()); // throw error
    // callback(undefined, true); // success
    // callback(undefined, false); // fail silently
  },
});

// defines a new router, router.get instead of app.get
const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    // send email is async operation, but no need to await
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    // custom method added on User model
    const user = await User.findByCredencials(
      req.body.email,
      req.body.password
    );
    // custom method added on user instances
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

// logout of all sessions
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    console.log(req.user.tokens);
    req.user.tokens = [];
    await req.user.save();
    console.log(req.user.tokens);
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

// middleware for specific route, pass in as 2nd argument
router.get("/users/me", auth, async (req, res) => {
  // Only going to run if auth middleware verifes thr token and found a user
  // sends back user's profile
  res.send(req.user);
});

// properties patched that does not exist on User will be ignored
router.patch("/users/me", auth, async (req, res) => {
  // make sure user only updates props that already exist
  const updates = Object.keys(req.body); // returns an array of keys
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Operations" });
  }
  try {
    // cannot use findByIdAndUpdate because we want to use bcrypt hashing as middleware
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    sendGoodByeEmail(req.user.email, req.user.name);
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// uploading new profile picture endpoint, multer middleware specify name of upload
// file upload is of type FormData
router.post(
  "/users/me/avatar",
  auth, // auth middleware befor others, if not authenticated, not accepting any upload
  upload.single("avatar"),
  async (req, res) => {
    // req.file accessable when not using dest:dirName in multer options

    // sharp is async
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  // callback argument to handle express error
  (error, req, res, next) => {
    if (error) {
      res.status(400).send({ error: error.message });
    }
  }
);

// delete current user's avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
  // set avatar to undefined to delete user's avatar
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    // set header Content-Type to image/jpg
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

// export the router
module.exports = router;
