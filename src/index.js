const express = require("express");

// mongoose file dosen't export anything
// call require just run the file and connect to db
require("./db/mongoose");

const User = require("./models/user");
const Task = require("./models/task");

const app = express();
app.use(express.json());

app.post("/users", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then((user) => res.status(201).send(res.send(user)))
    .catch((err) => res.status(400).send(err));
});

app.post("/tasks", (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then((task) => res.status(201).send(task))
    .catch((err) => res.status(400).send(err));
});

app.get("/users", (req, res) => {
  // pass in no query params in find method to get all users in User model
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send(err));
});

app.get("/users/:id", (req, res) => {
  const _id = req.params.id;
  // findOne or findById both works
  User.findById(_id)
    // if mongodb can't find anything, it is considered a success, NOT error
    .then((user) => {
      if (!user) {
        return res.status(404).send();
      }
      res.send(user); // default status code 200
    })
    .catch((err) => res.status(500).send(err));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
