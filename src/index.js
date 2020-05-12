const express = require("express");

// mongoose file dosen't export anything
// call require just run the file and connect to db
require("./db/mongoose");

const User = require("./models/user");
const Task = require("./models/task");

const app = express();
app.use(express.json());

app.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    const savedUser = await user.save();
    res.status(201).send(savedUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/users", async (req, res) => {
  try {
    // pass in no query params to find method to get all users in User model
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/users/:id", async (req, res) => {
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
app.patch("/users/:id", async (req, res) => {
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

app.delete("/users/:id", async (req, res) => {
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

app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  try {
    const savedTask = await task.save();
    res.status(201).send(savedTask);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.patch("/tasks/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const validUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) => validUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Operations" });
  }
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).send();
    }
    res.send(deletedTask);
  } catch (error) {
    res.status(500).send(error);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
