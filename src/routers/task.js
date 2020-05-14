const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    const savedTask = await task.save();
    res.status(201).send(savedTask);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=10 - give second page, 10 per page
// GET /tasks?sortBy=createdAt:desc
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "asc" ? 1 : -1;
  }
  try {
    // populate the virual field tasks for a given user
    await req.user
      .populate({
        // path - specify which field on user we are trying to populate
        path: "tasks",
        //  match - specify which tasks we are trying to match/filter
        match,
        // limit, skip, etc...
        options: {
          // if query params are not provided or NaN, options are ignored by mongoose
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          // sort by which field : order asc = 1, desc = -1
          sort,
        },
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    // find the task where owner-ObjectId field is equal to userId returned form auth
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const validUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) => validUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Operations" });
  }
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!deletedTask) {
      return res.status(404).send();
    }
    res.send(deletedTask);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
